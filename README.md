<p align="center">
  <img alt="GitHub package.json version (subfolder of monorepo)" src="https://img.shields.io/github/package-json/v/bitfocus/companion-module-vbaudio-voicemeeter">
  <img alt="GitHub Sponsors" src="https://img.shields.io/github/sponsors/thedist">
</p>

# companion-module-vbaudio-voicemeeter
Companion module for connecting either locally to Voicemeeter on the same machine as Companion, or act as a proxy on a remote machine.

For a guide on setting up a proxy, refer to [HELP.md](./companion/HELP.md)


# Recent Patches
**V1.3.0**
- Added `VBAN Settings`, `Macro Button`, and `Send Raw Command`, actions
- Added `VBAN` feedback
- Added Variables (`TYPE` is `instream` or `outstream`, and `INDEX` is 0 to 7)
  - `vban_on`
  - `vban_TYPE_INDEX_on`, `vban_TYPE_INDEX_name`, `vban_TYPE_INDEX_ip`, `vban_TYPE_INDEX_port`, `vban_TYPE_INDEX_sr`, `vban_TYPE_INDEX_channel`, `vban_TYPE_INDEX_bit`, `vban_TYPE_INDEX_quality`, `vban_TYPE_INDEX_route`
- Minor bug fixes

**V1.2.1**
- Added node-gyp dependency

**V1.2.0**
- Some Feature update and fixes contributed by @PI3RRE01
- Fixed recorder load, and gain, actions
- Fixed issue when using proxy
- Fixed issue with Bus and Strip mute/unmute
- Added Toggle/On/Off options for routing action
- Added Toggle Play/Stop option for recorder
- Fixed virtual audio strip meters
- Improved performance of feedback checks
- Added sponsor links on [Github](https://github.com/sponsors/thedist) and [Ko-Fi](https://ko-fi.com/thedist) for those who have asked to tip me for this continued development work.

**v1.1.1**
- Improved build output

**v1.1.0**
- Added graphical meters for strip and bus volume

**v1.0.0**
- Initial release