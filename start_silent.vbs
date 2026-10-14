CreateObject("Wscript.Shell").Run "cmd /c """ & Replace(WScript.ScriptFullName, "start_silent.vbs", "start.bat") & """", 0, False
