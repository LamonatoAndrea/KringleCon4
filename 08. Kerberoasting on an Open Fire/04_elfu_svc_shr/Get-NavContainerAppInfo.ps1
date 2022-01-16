﻿<# 
 .Synopsis
  Get App Info from NAV/BC Container
 .Description
  Creates a session to the NAV/BC Container and runs the CmdLet Get-NavAppInfo in the container
 .Parameter containerName
  Name of the container in which you want to enumerate apps
 .Parameter tenant
  Specifies the tenant from which you want to get the app info
 .Parameter tenantSpecificProperties
  Specifies whether you want to get the tenant specific app properties
 .Parameter symbolsOnly
  Specifies whether you only want apps, which are of packagetype SymbolsOnly (Specifying SymbolsOnly ignores the tenant parameter)
 .Parameter sort
  Specifies how (if any) you want to sort apps based on dependencies to other apps
 .Parameter publishedOnly
  Get published apps
 .Example
  Get-BcContainerAppInfo -containerName test2
 .Example
  Get-BcContainerAppInfo -containerName test2 -tenant mytenant -tenantSpecificProperties
 .Example
  Get-BcContainerAppInfo -containerName test2 -symbolsOnly
#>
function Get-BcContainerAppInfo {
    Param (
        [string] $containerName = $bcContainerHelperConfig.defaultContainerName,
        [string] $tenant = "",
        [switch] $symbolsOnly,
        [switch] $tenantSpecificProperties,
        [ValidateSet('None','DependenciesFirst','DependenciesLast')]
        [string] $sort = 'None',
        [switch] $publishedOnly,
        [switch] $installedOnly
    )

$telemetryScope = InitTelemetryScope -name $MyInvocation.InvocationName -parameterValues $PSBoundParameters -includeParameters @()
try {

    $args = @{}
    if ($symbolsOnly) {
        $args += @{ "SymbolsOnly" = $true }
    }
    elseif (!$publishedOnly) {
        if ($installedOnly) {
            $tenantSpecificProperties = $true
        }
        $args += @{ "TenantSpecificProperties" = $tenantSpecificProperties }
        if ("$tenant" -eq "") {
            $tenant = "default"
        }
        $args += @{ "Tenant" = $tenant }
    }

    Invoke-ScriptInBcContainer -containerName $containerName -ScriptBlock { Param($inArgs, $sort, $installedOnly)

        $script:installedApps = @()

        function AddAnApp { Param($anApp) 
            #Write-Host "AddAnApp $($anapp.Name) $($anapp.Version)"
            $alreadyAdded = $script:installedApps | Where-Object { $_.AppId -eq $anApp.AppId -and $_.Version -eq $anApp.Version }
            if (-not ($alreadyAdded)) {
                #Write-Host "add dependencies"
                AddDependencies -anApp $anApp
                #Write-Host "add the app $($anapp.Name)"
                $script:installedApps += $anApp
            }
        }
    
        function AddDependency { Param($dependency)
            #Write-Host "Add Dependency $($dependency.Name) $($dependency.Version)"
            $dependentApp = $apps | Where-Object { $_.AppId -eq $dependency.AppId  }
            if ($dependentApp) {
                AddAnApp -AnApp $dependentApp
            }
        }
    
        function AddDependencies { Param($anApp)
            #Write-Host "Add Dependencies for $($anApp.Name)"
            if (($anApp) -and ($anApp.Dependencies)) {
                $anApp.Dependencies | % { AddDependency -Dependency $_ }
            }
        }

        $apps = Get-NavAppInfo -ServerInstance $ServerInstance @inArgs | Where-Object { (!$installedOnly) -or ($_.IsInstalled -eq $true) } | ForEach-Object { Get-NavAppInfo -ServerInstance $serverInstance -id $_.AppId -publisher $_.publisher -name $_.name -version $_.Version @inArgs }
        if ($sort -eq "None") {
            $apps
        }
        else {
            $apps | ForEach-Object { AddAnApp -AnApp $_ }
            if ($sort -eq "DependenciesLast") {
                [Array]::Reverse($script:installedApps)
            }
            $script:installedApps
        }

    } -ArgumentList $args, $sort, $installedOnly | Where-Object {$_ -isnot [System.String]}
}
catch {
    TrackException -telemetryScope $telemetryScope -errorRecord $_
    throw
}
finally {
    TrackTrace -telemetryScope $telemetryScope
}
}
Set-Alias -Name Get-NavContainerAppInfo -Value Get-BcContainerAppInfo
Export-ModuleMember -Function Get-BcContainerAppInfo -Alias Get-NavContainerAppInfo
