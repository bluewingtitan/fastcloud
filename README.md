![# FastCloud](https://raw.githubusercontent.com/bluewingtitan/fastcloud/master/statics/Banner.png)

> FastCloud is a small, very simple and straight forward solution for all your file sharing needs. It's based on node.js and express and written in an hour because I wanted to share a few files in a dynamic way but found other solutions way too complicated to setup (or proprietary) for what I wanted them for.
> FastCloud is scribbly in nature and not ment to be used in production enviroments but in situations where it's enough to satisfy all needs and anything more complicated wouldn't be worth the extra time to set it up.


## How does it work?
After setup open (your ip/url):33658 (If you haven't forwarded any ports) in your browser.
A simple UI will appear. Choose a File to upload and type in the password (default is "fastcloud is cool" without "") and click "Upload!".
You will be granted with a link to share. Everyone with this link will be able to directly download the file by just visiting it.


FastCloud aims to deliver a simple experience that just works. Nothing too complicated, nothing completely unnecessary. No security or account stuff besided a very basic password check, because it aims for use cases where you just don't need it. There are a lot crazy, feature-rich solutions out there and I will never ever be able to hold up to them.
Use FastCloud if your needs are simple and your scale is small.

Features:

- Host Files (Right now everyone can upload, a basic password system will follow.)
- Download Files (You will get a dynamicly created link once you uploaded a file.)
- Basic Password before upload (basic plaintext in config, check on server-side, nothing too fancy)

Config:

- max-downloads (42069): The maximum amount a file can be downloaded before deletion.
- max-size-byte (134217728 = 128MB): The maximum size a uploaded file can have
- password ("fastcloud is cool"): The password needed to upload. Will not be sent to client side, but compared server-side on upload request.

Upcoming:

- Expiry date (Autodelete)


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

Optionaly setup a port forwarding of port 80 to 33658.
