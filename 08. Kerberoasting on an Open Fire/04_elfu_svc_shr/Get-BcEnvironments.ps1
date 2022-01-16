﻿<# 
 .Synopsis
  Function for retrieving a list of environments from an online Business Central tenant
 .Description
  Function for retrieving a list of environments from an online Business Central tenant
  Wrapper for https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/administration/administration-center-api#get-environments-and-get-environments-by-application-family
 .Parameter bcAuthContext
  Authorization Context created by New-BcAuthContext.
 .Parameter applicationFamily
  Application Family in which the environment is located. Default is BusinessCentral.
 .Example
  $authContext = New-BcAuthContext -includeDeviceLogin
  Get-BcEnvironments -bcAuthContext $authContext
#>
function Get-BcEnvironments {
    Param(
        [Parameter(Mandatory=$true)]
        [Hashtable] $bcAuthContext,
        [string] $applicationFamily = "BusinessCentral"
    )

$telemetryScope = InitTelemetryScope -name $MyInvocation.InvocationName -parameterValues $PSBoundParameters -includeParameters @()
try {

    $bcAuthContext = Renew-BcAuthContext -bcAuthContext $bcAuthContext
    $bearerAuthValue = "Bearer $($bcAuthContext.AccessToken)"
    $headers = @{ "Authorization" = $bearerAuthValue }
    try {
       (Invoke-RestMethod -Method Get -UseBasicParsing -Uri "$($bcContainerHelperConfig.apiBaseUrl.TrimEnd('/'))/admin/v2.3/applications/$applicationFamily/environments" -Headers $headers).Value
    }
    catch {
        throw (GetExtenedErrorMessage $_.Exception)
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
Export-ModuleMember -Function Get-BcEnvironments
