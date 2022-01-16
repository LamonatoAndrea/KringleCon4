﻿<# 
 .Synopsis
  Get list of users from NAV/BC Container
 .Description
  Retrieve the list of user objects from a tenant in a NAV/BC Container
 .Parameter containerName
  Name of the container from which you want to get the users
 .Parameter tenant
  Name of tenant from which you want to get the users
 .Example
  Get-BcContainerBcUser
 .Example
  Get-BcContainerBcUser -containerName test -tenant mytenant
#>
function Get-BcContainerBcUser {
    Param (
        [Parameter(Mandatory=$false)]
        [string] $containerName = $bcContainerHelperConfig.defaultContainerName,
        [Parameter(Mandatory=$false)]
        [string] $tenant = "default"
    )

$telemetryScope = InitTelemetryScope -name $MyInvocation.InvocationName -parameterValues $PSBoundParameters -includeParameters @()
try {
    Invoke-ScriptInBcContainer -containerName $containerName -ScriptBlock { param($tenant)
        Get-NavServerUser -ServerInstance $ServerInstance -tenant $tenant
    } -ArgumentList $tenant | Where-Object {$_ -isnot [System.String]}
}
catch {
    TrackException -telemetryScope $telemetryScope -errorRecord $_
    throw
}
finally {
    TrackTrace -telemetryScope $telemetryScope
}
}
Set-Alias -Name Get-NavContainerNavUser -Value Get-BcContainerBcUser
Export-ModuleMember -Function Get-BcContainerBcUser -Alias Get-NavContainerNavUser
