# Typo MSI Protocol Proposal

> MSI: Mod Sequence Injection

The Typo MSI Protocol is a way of sending custom data through skribbl draw commands.  
Its primary purpose is to bring back custom colors, but can also be used in the future to broadcast other data as a drawer, like current Don't Clear state or challenges.

## Protocol Basics
The protocol sends data "disguised" as valid draw commands.  
Therefore it lives under the constraints of valid draw command data, which consists of an integer array with following bounds:

```
[0] -> 0..2 (tool)
[1] -> 0..39 (color)
[2] -> 4..39 (size)
[3] -> 0..799 (startX)
[4] -> 0..599 (startY)
[5] -> 0..799 (endX)
[6] -> 0..599 (endY)
```

The goal is to send a decimal data package per draw command.  
Decimal data is encoded to a custom numeric base representation in index 3-6 to allow maximum package size.  
This results in following bases (d: decimal, o: octal, s: septal):
`odd cdd odd cdd` (named as MSI base in the following)

The maximum value per msi packet is `799 499 799 499` in the msi format, which represents a decimal value of `230399999999`.  
Therefore, this notation can store four whole bytes per packet.

## Protocol Sequence
The protocol consists of five phases.
### MSI init signal
The init signal is defined by the command `[0, 0, 5, 0,0,0,0]`.  
It initiates parsing of the injection sequence.
### Parsing the MSI mode
After a init signal has been received, every following command will be interpreted as decimal by parsing it as MSI base.  
The very first command sent after a start signal denotes the MSI mode.  
The MSI mode determines the application of the injected data; like setting a custom color.
### Parsing the MSI buffer
Following the MSI mode, commands are parsed from MSI base and their decimal representation added to a buffer.
### MSI finish signal
The end of the MSI buffer is signalized by a signal equivalent to the MSI init signal.  
When the finish signal is received, all required parameters are collected:
- MSI mode
- MSI buffer

From that, the mod is constructed.
Using the parameters, the mod returns a function that receives & returns a (potentially modified) draw command and will be applied to each following draw command.  
Mods can also execute one-time actions on construction and return an empty function which does not modify following draw commands.
### MSI reset signal
The reset signal is defined by the command `[0, 0, 39, 0,0,0,0]`.  
It resets the current mod function and following draw commands will be regulary parsed only by skribbl.

## Implementation
The protocol functions are implemented in the "typo" functions in the game patch.  
The receiving end sends each received draw command to the protocol parser, which processes the command and applies it to the MSI state.  
If the command was part of the msi protocol, the parser returns undefined and the command is ignored.  
If the parser returns a command, it is either the original command or the modified command if a MSI mod was currently active.  

The sender/drawer which initiates MSI protocol packets needs to invoke sending the MSI packets in different places of the code.  
For example, the color mod is implemented in a proxy of the socket emit function.  
There, it listens to outgoing events and intercepts command packets.  
The intercepted command packets are processed and if necessary, MSI sequences are added.  
Also, after a sequence is sent, an "undo" event is sent to the server, which removes all lines that have been created by the MSI packet sequence for non-typo clients.

Additionally, the sender can send a 

## Considerations
The protocol has two downsides:
- Large overhead for frequent application, like rapid color change
- False positive of init/reset signal

The overhead will be tolerated since most applications reuquire only rare use of the protocol in relation to actual sent draw commands (color switches rather rarely).

The current overhead is at least 4 commands for a color switch; with less versatility it could be reduced to 2 commands (removing the finish signal and mode identifier); but versatility is preferred over this slight improvement.

False positives are not avoidable since by definition, the protocol can only consist of valid draw commands.

## Example
An example to initiate & reset a custom color:
- `[0, 0, 5, 0,0,0,0]` - MSI init signal
- `[0, 0, 5, 0,0,0,1]` - Set MSI mode to 1 (eg custom color mod)
- `[0, 0, 5, 0,0,33,200]` - Send the decimal data "20000" which represents a custom typo color code
- `[0, 0, 5, 0,0,0,0]` - MSI finish signal  
-  *regular draw commands - will be modified by color mod*
- `[0, 0, 39, 799,599,799,599]` - MSI reset signal / stop custom color mod

## Color Mod
The color mod implements the protocol.  
For this, a mode is added to the protocol parser, which modifies incoming commands with a set color (received by protocol).

The drawer has to make sure the mod initiation/reset sequences are sent when the color is switched.
- "drawing finished" should always reset MSI state
- when draw commands are sent, the color code should be checked.
- if the color code is a typo code and not yet initiated, an initiation sequence is created, sent, and the current color updated
- if a skribbl color is chosen and a typo color not reset, a msi reset is sent and the current color reset