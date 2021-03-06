# Copyright (C) Microsoft Corporation.  All rights reserved.

function Get-NugetExe
{
<#
    .SYNOPSIS
        Downloads nuget.exe from http://nuget.org to a new local temporary directory
        and returns the path to the local copy.

    .DESCRIPTION
        Downloads nuget.exe from http://nuget.org to a new local temporary directory
        and returns the path to the local copy.

        The Git repo for this module can be found here: http://aka.ms/StoreBroker

    .EXAMPLE
        Get-NugetExe
        Creates a new directory with a GUID under $env:TEMP and then downloads
        http://nuget.org/nuget.exe to that location.

    .OUTPUTS
        System.String - The path to the newly downloaded nuget.exe
#>
    [CmdletBinding(SupportsShouldProcess)]
    [Diagnostics.CodeAnalysis.SuppressMessageAttribute("PSShouldProcess", "", Justification="Methods called within here make use of PSShouldProcess, and the switch is passed on to them inherently.")]
    param()

    if ($null -eq $script:nugetExePath)
    {
        $sourceNugetExe = "https://dist.nuget.org/win-x86-commandline/latest/nuget.exe"
        $script:nugetExePath = Join-Path $(New-TemporaryDirectory) "nuget.exe"

        Write-Log -Message "Downloading $sourceNugetExe to $script:nugetExePath" -Level Verbose
        Invoke-WebRequest $sourceNugetExe -OutFile $script:nugetExePath
    }

    return $script:nugetExePath
}

function Get-NugetPackage
{
<#
    .SYNOPSIS
        Downloads a nuget package to the specified directory.

    .DESCRIPTION
        Downloads a nuget package to the specified directory (or the current
        directory if no TargetPath was specified).

        The Git repo for this module can be found here: http://aka.ms/StoreBroker

    .PARAMETER PackageName
        The name of the nuget package to download

    .PARAMETER TargetPath
        The nuget package will be downloaded to this location.

    .PARAMETER Version
        If provided, this indicates the version of the package to download.
        If not specified, downloads the latest version.

    .PARAMETER NoStatus
        If this switch is specified, long-running commands will run on the main thread
        with no commandline status update.  When not specified, those commands run in
        the background, enabling the command prompt to provide status information.

    .EXAMPLE
        Get-NugetPackage "Microsoft.AzureStorage" -Version "6.0.0.0" -TargetPath "c:\foo"
        Downloads v6.0.0.0 of the Microsoft.AzureStorage nuget package to the c:\foo directory.

    .EXAMPLE
        Get-NugetPackage "Microsoft.AzureStorage" "c:\foo"
        Downloads the most recent version of the Microsoft.AzureStorage
        nuget package to the c:\foo directory.
#>
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(
            Mandatory,
            ValueFromPipeline)]
        [string] $PackageName,

        [Parameter(Mandatory)]
        [ValidateScript({if (Test-Path -Path $_ -PathType Container) { $true } else { throw "$_ does not exist." }})]
        [string] $TargetPath,

        [string] $Version = "",

        [switch] $NoStatus
    )

    Write-Log -Message "Downloading nuget package [$PackageName] to [$TargetPath]" -Level Verbose

    $nugetPath = Get-NugetExe

    if ($NoStatus)
    {
        if ($PSCmdlet.ShouldProcess($PackageName, $nugetPath))
        {
            if (-not [System.String]::IsNullOrEmpty($Version))
            {
                & $nugetPath install $PackageName -o $TargetPath -version $Version -source nuget.org -NonInteractive | Out-Null
            }
            else
            {
                & $nugetPath install $PackageName -o $TargetPath -source nuget.org -NonInteractive | Out-Null
            }
        }
    }
    else
    {
        $jobName = "Get-NugetPackage-" + (Get-Date).ToFileTime().ToString()

        if ($PSCmdlet.ShouldProcess($jobName, "Start-Job"))
        {
            [scriptblock]$scriptBlock = {
                param($NugetPath, $PackageName, $TargetPath, $Version)

                if (-not [System.String]::IsNullOrEmpty($Version))
                {
                    & $NugetPath install $PackageName -o $TargetPath -version $Version -source nuget.org
                }
                else
                {
                    & $NugetPath install $PackageName -o $TargetPath -source nuget.org
                }
            }

            Start-Job -Name $jobName -ScriptBlock $scriptBlock -Arg @($nugetPath, $PackageName, $TargetPath, $Version) | Out-Null

            if ($PSCmdlet.ShouldProcess($jobName, "Wait-JobWithAnimation"))
            {
                Wait-JobWithAnimation -JobName $jobName -Description "Retrieving nuget package: $PackageName"
            }

            if ($PSCmdlet.ShouldProcess($jobName, "Receive-Job"))
            {
                Receive-Job $jobName -AutoRemoveJob -Wait -ErrorAction SilentlyContinue -ErrorVariable remoteErrors | Out-Null
            }
        }

        if ($remoteErrors.Count -gt 0)
        {
            throw $remoteErrors[0].Exception
        }
    }
}

function Test-AssemblyIsDesiredVersion
{
    <#
    .SYNOPSIS
        Checks if the specified file is the expected version.

    .DESCRIPTION
        Checks if the specified file is the expected version.

        Does a best effort match.  If you only specify a desired version of "6",
        any version of the file that has a "major" version of 6 will be considered
        a match, where we use the terminology of a version being:
        Major.Minor.Build.PrivateInfo.

        The Git repo for this module can be found here: http://aka.ms/StoreBroker

    .PARAMETER AssemblyPath
        The full path to the assembly file being tested.

    .PARAMETER DesiredVersion
        The desired version of the assembly.  Specify the version as specifically as
        necessary.

    .EXAMPLE
        Test-AssemblyIsDesiredVersion "c:\Microsoft.WindowsAzure.Storage.dll" "6"

        Returns back $true if "c:\Microsoft.WindowsAzure.Storage.dll" has a major version
        of 6, regardless of its Minor, Build or PrivateInfo numbers.

    .OUTPUTS
        Boolean - $true if the assembly at the specified path exists and meets the specified
        version criteria, $false otherwise.
#>
    param(
        [Parameter(Mandatory)]
        [ValidateScript( { if (Test-Path -PathType Leaf -Path $_) { $true }  else { throw "'$_' cannot be found." } })]
        [string] $AssemblyPath,

        [Parameter(Mandatory)]
        [ValidateScript( { if ($_ -match '^\d+(\.\d+){0,3}$') { $true } else { throw "'$_' not a valid version format." } })]
        [string] $DesiredVersion
    )

    $splitTargetVer = $DesiredVersion.Split('.')

    $file = Get-Item -Path $AssemblyPath -ErrorVariable ev
    if (($null -ne $ev) -and ($ev.Count -gt 0))
    {
        Write-Log "Problem accessing [$Path]: $($ev[0].Exception.Message)" -Level Warning
        return $false
    }

    $versionInfo = $file.VersionInfo
    $splitSourceVer = @(
        $versionInfo.ProductMajorPart,
        $versionInfo.ProductMinorPart,
        $versionInfo.ProductBuildPart,
        $versionInfo.ProductPrivatePart
    )

    # The cmdlet contract states that we only care about matching
    # as much of the version number as the user has supplied.
    for ($i = 0; $i -lt $splitTargetVer.Count; $i++)
    {
        if ($splitSourceVer[$i] -ne $splitTargetVer[$i])
        {
            return $false
        }
    }

    return $true
}

function Get-NugetPackageDllPath
{
<#
    .SYNOPSIS
        Makes sure that the specified assembly from a nuget package is available
        on the machine, and returns the path to it.

    .DESCRIPTION
        Makes sure that the specified assembly from a nuget package is available
        on the machine, and returns the path to it.

        This will first look for the assembly in the module's script directory.

        Next it will look for the assembly in the location defined by
        $SBAlternateAssemblyDir.  This value would have to be defined by the user
        prior to execution of this cmdlet.

        If not found there, it will look in a temp folder established during this
        PowerShell session.

        If still not found, it will download the nuget package
        for it to a temp folder accessible during this PowerShell session.

        The Git repo for this module can be found here: http://aka.ms/StoreBroker

    .PARAMETER NugetPackageName
        The name of the nuget package to download

    .PARAMETER NugetPackageVersion
        Indicates the version of the package to download.

    .PARAMETER AssemblyPackageTailDirectory
        The sub-path within the nuget package download location where the assembly should be found.

    .PARAMETER AssemblyName
        The name of the actual assembly that the user is looking for.

    .PARAMETER NoStatus
        If this switch is specified, long-running commands will run on the main thread
        with no commandline status update.  When not specified, those commands run in
        the background, enabling the command prompt to provide status information.

    .EXAMPLE
        Get-NugetPackageDllPath "WindowsAzure.Storage" "6.0.0" "WindowsAzure.Storage.6.0.0\lib\net40\" "Microsoft.WindowsAzure.Storage.dll"

        Returns back the path to "Microsoft.WindowsAzure.Storage.dll", which is part of the
        "WindowsAzure.Storage" nuget package.  If the package has to be downloaded via nuget,
        the command prompt will show a time duration status counter while the package is being
        downloaded.

    .EXAMPLE
        Get-NugetPackageDllPath "WindowsAzure.Storage" "6.0.0" "WindowsAzure.Storage.6.0.0\lib\net40\" "Microsoft.WindowsAzure.Storage.dll" -NoStatus

        Returns back the path to "Microsoft.WindowsAzure.Storage.dll", which is part of the
        "WindowsAzure.Storage" nuget package.  If the package has to be downloaded via nuget,
        the command prompt will appear to hang during this time.

    .OUTPUTS
        System.String - The full path to $AssemblyName.
#>
    [CmdletBinding(SupportsShouldProcess)]
    [Diagnostics.CodeAnalysis.SuppressMessageAttribute("PSShouldProcess", "", Justification="Methods called within here make use of PSShouldProcess, and the switch is passed on to them inherently.")]
    param(
        [Parameter(Mandatory)]
        [string] $NugetPackageName,

        [Parameter(Mandatory)]
        [string] $NugetPackageVersion,

        [Parameter(Mandatory)]
        [string] $AssemblyPackageTailDirectory,

        [Parameter(Mandatory)]
        [string] $AssemblyName,

        [switch] $NoStatus
    )

    Write-Log -Message "Looking for $AssemblyName" -Level Verbose

    # First we'll check to see if the user has cached the assembly into the module's script directory
    $moduleAssembly = Join-Path $PSScriptRoot $AssemblyName
    if (Test-Path -Path $moduleAssembly -PathType Leaf -ErrorAction Ignore)
    {
        if (Test-AssemblyIsDesiredVersion -AssemblyPath $moduleAssembly -DesiredVersion $NugetPackageVersion)
        {
            Write-Log -Message "Found $AssemblyName in module directory ($PSScriptRoot)." -Level Verbose
            return $moduleAssembly
        }
        else
        {
            Write-Log -Message "Found $AssemblyName in module directory ($PSScriptRoot), but its version number didn't match required [$NugetPackageVersion]." -Level Verbose
        }
    }

    # Next, we'll check to see if the user has defined an alternate path to get the assembly from
    if (-not [System.String]::IsNullOrEmpty($SBAlternateAssemblyDir))
    {
        $alternateAssemblyPath = Join-Path $SBAlternateAssemblyDir $AssemblyName
        if (Test-Path -Path $alternateAssemblyPath -PathType Leaf -ErrorAction Ignore)
        {
            if (Test-AssemblyIsDesiredVersion -AssemblyPath $alternateAssemblyPath -DesiredVersion $NugetPackageVersion)
            {
                Write-Log -Message "Found $AssemblyName in alternate directory ($SBAlternateAssemblyDir)." -Level Verbose
                return $alternateAssemblyPath
            }
            else
            {
                Write-Log -Message "Found $AssemblyName in alternate directory ($SBAlternateAssemblyDir), but its version number didn't match required [$NugetPackageVersion]." -Level Verbose
            }
        }
    }

    # Then we'll check to see if we've previously cached the assembly in a temp folder during this PowerShell session
    if ([System.String]::IsNullOrEmpty($script:tempAssemblyCacheDir))
    {
        $script:tempAssemblyCacheDir = New-TemporaryDirectory
    }
    else
    {
        $cachedAssemblyPath = Join-Path $(Join-Path $script:tempAssemblyCacheDir $AssemblyPackageTailDirectory) $AssemblyName
        if (Test-Path -Path $cachedAssemblyPath -PathType Leaf -ErrorAction Ignore)
        {
            if (Test-AssemblyIsDesiredVersion -AssemblyPath $cachedAssemblyPath -DesiredVersion $NugetPackageVersion)
            {
                Write-Log -Message "Found $AssemblyName in temp directory ($script:tempAssemblyCacheDir)." -Level Verbose
                return $cachedAssemblyPath
            }
            else
            {
                Write-Log -Message "Found $AssemblyName in temp directory ($script:tempAssemblyCacheDir), but its version number didn't match required [$NugetPackageVersion]." -Level Verbose
            }
        }
    }

    # Still not found, so we'll go ahead and download the package via nuget.
    Write-Log -Message "$AssemblyName is needed and wasn't found.  Acquiring it via nuget..." -Level Verbose
    Get-NugetPackage -PackageName $NugetPackageName -Version $NugetPackageVersion -TargetPath $script:tempAssemblyCacheDir -NoStatus:$NoStatus

    $cachedAssemblyPath = Join-Path $(Join-Path $script:tempAssemblyCacheDir $AssemblyPackageTailDirectory) $AssemblyName
    if (Test-Path -Path $cachedAssemblyPath -PathType Leaf -ErrorAction Ignore)
    {
        Write-Log -Message @(
            "To avoid this download delay in the future, copy the following file:",
            "  [$cachedAssemblyPath]",
            "either to:",
            "  [$PSScriptRoot]",
            "or to:",
            "  a directory of your choosing, and save that directory path to `$SBAlternateAssemblyDir")

        return $cachedAssemblyPath
    }

    $output = "Unable to acquire a reference to $AssemblyName."
    Write-Log -Message $output -Level Error
    throw $output
}
