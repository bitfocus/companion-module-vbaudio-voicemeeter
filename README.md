<p align="center">
  <img alt="GitHub package.json version (subfolder of monorepo)" src="https://img.shields.io/github/package-json/v/bitfocus/companion-module-vbaudio-voicemeeter">
  <img alt="GitHub Sponsors" src="https://img.shields.io/github/sponsors/thedist">
</p>

# companion-module-vbaudio-voicemeeter
Companion module for connecting either locally to Voicemeeter on the same machine as Companion, or act as a proxy on a remote machine.

For a guide on setting up a proxy, refer to [HELP.md](./companion/HELP.md)


# Recent Patches
**v2.2.1**
- Fixed an issue adjusting strip gain to selected busses
- Fixed an issue with the Load XML command sending the wrong command
- Removed redundant Companion status updates to reduce log spam

**v2.2.0**
- Added `Strip - EQ Gain 1 to 3 (Virtual Strips)` Action for setting the 3 EQ settings on Virtual Strips
- Added a solution to force an update of data from Voicemeeter on launch
- Added `/data` HTTP endpoint for retrieving all current Voicemeeter data in JSON format
- Added Local variable support for Text Input fields
- Better support for asynchronous actions, improving running multiple actions consecutively
- Fixed issue with several variables having incorrect values

**v2.1.0**
- Minor fix to variable definitions to improve performance

**v2.0.0**
- Complete revamp of modules connection to Voicemeeter, using VBAN instead of a DLL hook. This change is due to the deprecation of the libraries used to directly connect, problems with compatibility, and issues with remote connections.
- REQUIRES Voicemeeter version 3.1.1.3 (Potato), 2.1.1.3 (Banana), or 1.1.1.3 (Standard)
- VBANAs  provides access to less data, there is some loss of functionality. Also some Strip related data isn't populated until the first change which triggers Voicemeeter to send the data.
- Added VBAN connection for both sending commands and getting real-time data from Voicemeeter
- Actions
  - `Bus - Returns` and `Recorder - Gain` - No longer support relative changes, and only supports setting a specific value.
  - `Recorder - Position Control` - Removed Play/Stop toggle
  - `Recorder - Arm Bus or Strip` - Removed toggle option, now has a setting for a specific state
- Feedback - Removed the follow Feedbacks
  - `Recorder - Arming`, `Recorder - Armed Inputs or Outputs`, `Recorder - State`, `VBAN`
- Variables - Added the following Variables
  - `strip_X_pitch`, `strip_X_pitch_value`, `strip_X_pitch_drywet`, `strip_X_pitch_formant_lo`, `strip_X_pitch_formant_med`, `strip_X_pitch_formant_hi`
- Variables - Removed the following Variables
  - `bus_X_return_reverb`, `bus_X_return_delay`, `bus_X_return_fx1`, `bus_X_return_fx2`, `strip_X_compressor`, `strip_X_gate`

**v1.3.0**
- Added `VBAN Settings`, `Macro Button`, and `Send Raw Command`, actions
- Added `VBAN` feedback
- Added Variables (`TYPE` is `instream` or `outstream`, and `INDEX` is 0 to 7)
  - `vban_on`
  - `vban_TYPE_INDEX_on`, `vban_TYPE_INDEX_name`, `vban_TYPE_INDEX_ip`, `vban_TYPE_INDEX_port`, `vban_TYPE_INDEX_sr`, `vban_TYPE_INDEX_channel`, `vban_TYPE_INDEX_bit`, `vban_TYPE_INDEX_quality`, `vban_TYPE_INDEX_route`
- Minor bug fixes

**v1.2.1**
- Added node-gyp dependency

**v1.2.0**
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
