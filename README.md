![# FastCloud](https://raw.githubusercontent.com/bluewingtitan/fastcloud/master/statics/Banner.png)

⚠️ **DON'T USE FastCloud IN PRODUCTIVE ENVIROMENTS.** I wasn't able to break it, but I won't gurantee for absolute safety and uptime.

I am using it for my personal quick file sharing needs (cat pictures and some of my music). That's what I have intended it for. Time efficient and personal filesharing.

> FastCloud is a small, very simple and straight forward solution for all your file sharing needs. It's based on node.js and express because I wanted to share a few files in a dynamic way but found other solutions way too complicated to setup (or proprietary) for what I wanted them for.

> FastCloud was inspired by Firefox Send, the most straight forward file sharing experience I ever had, that sadly got discontinued.

## How does it work?
After setup open (your ip/url):33658 (If you haven't forwarded the port) in your browser.
A simple UI will appear. Choose a File to upload and type in the password (default is "fastcloud is cool" without "") and click "Upload!".
You will be granted with a link to share. Everyone with this link will be able to directly download the file by just visiting it.
If you haven't setup port forwarding you will need to add the port into the url, wasn't able to make this part work.

Features:

- Host Files (Upload is protected by a master-password set in config.)
- Download Files (You will get a dynamicly created link once you uploaded a file.)
- Automatic deletion of files based on capped downloads amount and/or expiry time.



Config ("out-of-the-box"-settings in parenthesis):

- password ("fastcloud is cool"): The password needed to upload. Will not be sent to client side, but compared server-side on upload request. CHANGE THIS!
- max-downloads (42069): The maximum amount a file can be downloaded before deletion. Set to -1 for infinite downloads.
- max-size-byte (134217728 = 128MB): The maximum size a uploaded file can have.
- hours-before-expiry(48): How many hours shall a file survive? The check happens for all files at once every 30 minutes, so this is not exact.
- style("dark"): Set "light" for lightmode, "dark" for darkmode. There are "white" and "black" for fully monochromatic styles.


>Am I allowed to use FastCloud for...
Yes.
Use it for whatever you want.
MIT Licence Baby.




# Setup FastCloud
1. Clone FastCloud Repo
2. Edit Config (Optional)
3. npm install
4. npm start
5. Have fun

Setup a port forwarding of port 80 to 33658 for a more comfortable experience for usage over dns.


# Reset FastCloud
STOP FASTCLOUD BEFORE DOING THIS!
You are able to delete all user-uploaded files known to FastCloud at the moment with the command 'npm run reset' or 'node reset.js' inside the FastCloud directory.
This will lead to a clean slate without any files left over.
If you want to do it the manual way: Delete the directory 'files' and replace the content of files.json with a simple '{}' (without '').
