![# FastCloud](https://raw.githubusercontent.com/bluewingtitan/fastcloud/master/statics/Banner.png)

> FastCloud is a small, very simple and straight forward solution for all your file hosting needs. It's based on node.js and express and written in an hour because I wanted to share a few files in a dynamic way but found other solutions way to complicated to setup (or proprietary) for what I wanted them for.
> FastCloud is scribbly in nature and not ment to be used in production enviroments but in situations where it's enough to satisfy all needs and anything more complicated wouldn't be worth the extra time to set it up.

FastCloud aims to deliver a simple experience that just works. Nothing too complicated, nothing completely unnecessary. No security or account stuff because it aims for use cases where you just don't need that. There are a lot crazy, feature-rich solutions out there and I will never ever be able to hold up to them.
Use FastCloud if your needs are simple.

Features:

- Host Files (Right now everyone can upload, a basic password system will follow.)
- Download Files (You will get a dynamicly created link once you uploaded a file.)

Config:

- max-downloads (42069): The maximum amount a file can be downloaded before deletion.
- max-size-byte (134217728 = 128MB): The maximum size a uploaded file can have
- password ("fastcloud is cool"): Unused right now. Will be used for password protecting upload-process.

Upcoming:

- Expiry date (Autodelete)
- Basic Password before upload (basic plaintext in config, check on server-side, nothing too fancy)

Am I allowed to use FastCloud for...
Yes.
Use it for whatever you want.
MIT Licence Baby.




# Setup FastCloud
1. Clone FastCloud Repo
2. Edit Config (Optional)
3. npm install
4. npm start
5. Have fun
