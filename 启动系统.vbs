' Double Cert Management System - VBS Launcher
' Double-click this file to start the system

Option Explicit

Dim objShell, objFSO, strScriptDir, strLauncherJS
Dim strNodePath, strCmd, intResult

Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the directory of this script
strScriptDir = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Check if node.exe is available
On Error Resume Next
strNodePath = objShell.ExpandEnvironmentStrings("%COMSPEC%")
On Error GoTo 0

' Verify node.exe exists in PATH
On Error Resume Next
strNodePath = objShell.RegRead("HKEY_LOCAL_MACHINE\SOFTWARE\Node.js\InstallPath")
If Err.Number <> 0 Then
    strNodePath = ""
End If
On Error GoTo 0

' Construct path to launcher.js
strLauncherJS = objFSO.BuildPath(strScriptDir, "launcher.js")

If Not objFSO.FileExists(strLauncherJS) Then
    MsgBox "Error: launcher.js not found in " & strScriptDir, vbCritical, "Startup Failed"
    WScript.Quit 1
End If

' Run the launcher in a visible console window
' Using cmd.exe /k to keep the window open so users can see status
strCmd = "cmd /k ""cd /d """ & strScriptDir & """ && node.exe """ & strLauncherJS & """"""

On Error Resume Next
objShell.Run strCmd, 1, False
intResult = Err.Number
On Error GoTo 0

If intResult <> 0 Then
    MsgBox "Failed to start. Please make sure Node.js is installed." & vbCrLf & _
           "Download: https://nodejs.org/", vbCritical, "Startup Failed"
    WScript.Quit 1
End If

WScript.Quit 0
