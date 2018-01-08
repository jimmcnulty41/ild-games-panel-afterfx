# ILD Games Adobe Scripts

This is a collection of scripts used to extend adobe product to
improve game development workflows

# Dependencies

You will need node and npm
In Windows, you will want to allow Everyone to have write permissions to your
scripts folder

For vscode, the following task will build and copy to your scripts folder

    {
        "label": "build",
        "type": "shell",
        "command": "tsc; node build.js",
        "group": {
            "kind": "build",
            "isDefault": true
        }
    }
