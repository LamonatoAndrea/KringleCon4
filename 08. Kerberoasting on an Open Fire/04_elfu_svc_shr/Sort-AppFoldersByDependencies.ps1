﻿<# 
 .Synopsis
  Sort an array of app folders
 .Description
  Sort an array of app folders with dependencies first, for compile and publish order
 .Parameter appFolders
  Array of folders including an app.json
 .Parameter baseFolder
  If specified, all appFolders in the array are subFolders to this folder.
 .Parameter unknownDependencies
  If specified, this reference parameter will contain unresolved dependencies after sorting
 .Example
  $folders = Sort-AppFoldersByDependencies -appFolders @($folder1, $folder2)
#>
function Sort-AppFoldersByDependencies {
    Param(
        [Parameter(Mandatory=$false)]
        [string[]] $appFolders,
        [Parameter(Mandatory=$false)]
        [string] $baseFolder = "",
        [Parameter(Mandatory=$false)]
        [ref] $unknownDependencies
    )

$telemetryScope = InitTelemetryScope -name $MyInvocation.InvocationName -parameterValues $PSBoundParameters -includeParameters @()
try {

    if (!$appFolders) {
        return @()
    }

    if ($baseFolder) {
        $baseFolder = $baseFolder.TrimEnd('\')+'\'
    }

    # Read all app.json objects, populate $apps
    $apps = $()
    $folders = @{}
    $appFolders | ForEach-Object {
        $appFolder = "$baseFolder$_"
        $appJsonFile = Join-Path $appFolder "app.json"
        if (-not (Test-Path -Path $appJsonFile)) {
            Write-Warning "$appFolder doesn't contain app.json"
        }
        else {
            $appJson = Get-Content -Path $appJsonFile | ConvertFrom-Json
            
            # replace id with appid
            if ($appJson.psobject.Members | Where-Object name -eq "dependencies") {
                if ($appJson.dependencies) {
                    $appJson.dependencies = $appJson.dependencies | % {
                        if ($_.psobject.Members | where-object membertype -like 'noteproperty' | Where-Object name -eq "id") {
                            New-Object psobject -Property ([ordered]@{ "appId" = $_.id; "publisher" = $_.publisher; "name" = $_.name; "version" = $_.version })
                        }
                        else {
                            $_
                        }
                    }
                }
            }

            $folders += @{ "$($appJson.Id):$($appJson.Version)" = $appFolder }
            $apps += @($appJson)
        }
    }
    
    # Populate SortedApps and UnresolvedDependencies
    $script:sortedApps = @()
    $script:unresolvedDependencies = $()

    function AddAnApp { Param($anApp) 
        $alreadyAdded = $script:sortedApps | Where-Object { $_.Id -eq $anApp.Id }
        if (-not ($alreadyAdded)) {
            AddDependencies -anApp $anApp
            $script:sortedApps += $anApp
        }
    }
    
    function AddDependency { Param($dependency)
        $dependencyAppId = "$(if ($dependency.PSObject.Properties.name -eq 'AppId') { $dependency.AppId } else { $dependency.Id })"
        $dependentApp = $apps | Where-Object { $_.Id -eq $dependencyAppId }
        if ($dependentApp) {
            AddAnApp -AnApp $dependentApp
        }
        else {
            if (-not ($script:unresolvedDependencies | Where-Object { $_ } | Where-Object { "$(if ($_.PSObject.Properties.name -eq 'AppId') { $_.AppId } else { $_.Id })" -eq $dependencyAppId })) {
                $appFileName = "$($dependency.publisher)_$($dependency.name)_$($dependency.version)).app".Split([System.IO.Path]::GetInvalidFileNameChars()) -join ''
                if ($dependencyAppid -ne '63ca2fa4-4f03-4f2b-a480-172fef340d3f' -and $dependencyAppId -ne '437dbf0e-84ff-417a-965d-ed2bb9650972') {
                    Write-Warning "Dependency $($dependencyAppId):$appFileName not found"
                }
                $script:unresolvedDependencies += @($dependency)
            }
        }
    }
    
    function AddDependencies { Param($anApp)
        if ($anApp) {
            if ($anApp.psobject.Members | Where-Object name -eq "dependencies") {
                if ($anApp.Dependencies) {
                    $anApp.Dependencies | ForEach-Object { AddDependency -Dependency $_ }
                }
            }
        }
    }
    
    $apps | Where-Object { $_.Name -eq "Application" } | ForEach-Object { AddAnApp -anApp $_ }
    $apps | ForEach-Object { AddAnApp -AnApp $_ }

    $script:sortedApps | ForEach-Object {
        ($folders["$($_.id):$($_.version)"]).SubString($baseFolder.Length)
    }
    if ($unknownDependencies) {
        $unknownDependencies.value = @($script:unresolvedDependencies | ForEach-Object { if ($_) { 
            "$(if ($_.PSObject.Properties.name -eq 'AppId') { $_.AppId } else { $_.Id }):" + $("$($_.publisher)_$($_.name)_$($_.version).app".Split([System.IO.Path]::GetInvalidFileNameChars()) -join '')
		} })
    }
}
catch {
    TrackException -telemetryScope $telemetryScope -errorRecord $_
    throw
}
finally {
    TrackTrace -telemetryScope $telemetryScope
}
}
Export-ModuleMember -Function Sort-AppFoldersByDependencies
