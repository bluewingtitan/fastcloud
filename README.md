![# FastCloud](https://raw.githubusercontent.com/bluewingtitan/fastcloud/master/statics/Banner.png)

**Easy File Sharing in 5 minutes.**

> FastCloud is a small, very simple and straight forward solution for your file sharing needs. It's based on node.js and express and allows for files in a fast and easy way. I only found solutions that were way too complicated to setup (or proprietary) for what I wanted them for, so I created FastCloud.

> FastCloud is inspired by Firefox Send, the most straight forward file sharing experience I ever had, that sadly got discontinued.

## How does it work?
After setup, open the adress it's running under in your browser (port is 33658, setup your reverse proxy to point at it for ease of use).
Choose a File to upload and type in the password (default is "fastcloud is cool" without "") and click "Upload!".
You will be granted with a link to share. Everyone with this link will be able to download the file by just visiting it.

Features:

- Host Files (Upload is protected by a master-password set in config.)
- Download Preview Pages
- Download Files (You will get a dynamicly created link once you uploaded a file.)
- Automatic deletion of files based on capped downloads amount and/or expiry time.
- Dynamic Theming



Config ("out-of-the-box"-settings in parenthesis):

- password ("fastcloud is cool"): The password needed to upload. CHANGE THIS!
- max-downloads (42069): The maximum amount a file can be downloaded before deletion. -1 for infinite downloads.
- max-size-byte (134217728 = 128MB): The maximum size a uploaded file can have.
- hours-before-expiry(48): How many hours shall a file survive? The check happens for all files, once every 30 minutes, so this is not exact.
- style("dark"): Set "light" for lightmode, "dark" for darkmode. There are "white" and "black" for monochromatic styles.


> Am I allowed to use FastCloud for...
Yes.
Use it for whatever you want, on your own risk.
MIT-License, baby.




# Setup FastCloud
1. Clone FastCloud Repo
2. Edit Config (CHANGE THE DEFAULT PASSWORD!)
3. npm install
4. npm start
5. Have fun

Setup your reverse proxy (nginx or whatever) to point to it, running at port 33658.

Make sure to use https in 'production' (don't use in actual production env), as the master password is sent unencrypted in itself (simplicity, fastcloud is a "polished MVP" after all).


# Reset FastCloud
STOP FASTCLOUD BEFORE DOING THIS!
You are able to delete all user-uploaded files known to FastCloud at the moment with the command 'npm run reset' or 'node reset.js' inside the FastCloud directory.
This will lead to a clean slate without any files left over.
If you want to do it the manual way: Delete the directory 'files' and replace the content of files.json with a simple '{}' (without '').
