##<i>This app is renamed to WizLan and will be maintained under the new name. The reason it is renamed is that the app is tried to be posted at Homey App store. Homey's standard recommended giving the app a new name as the old one was not explanatory enough.</i>
<br><br>
# WizWifi app for Homey *(Unofficial app for Wiz Connected devices.)*

The company Wiz ([https://www.wizconnected.com/](https://www.wizconnected.com/)) has developed several smart light bulbs and other devices based on a WiFi interface. In order to be able to use the bulbs and other devices (in the local WiFi network) together with Homey, there was a need to develop a new app. The app is not based on any official API from Wiz, and the use of the app is therefore at your own risk.

## Support

Support for all Wiz light bulbs and devices cannot be guaranteed, but most should work. Most wiz light bulbs, lamps, LED strips and smart plugs should work relative to the functionality that the device has (color, dimmable, white color adjustable and smart plug with and without power reading). The current application uses SDK 3 and Homey =>5.0.0.<br><br>
The app is a completely new app, but still based on the experiences from the first app WizBulbs. This app was based on individual products from Wiz, but the new one is based on groups of functionality. This means that you will have direct support for more devices than you had before. There are three groups dealing with light, dimmable, white adjustment / dimming and color. In addition, there are two groups for SmartPlugs (with or without current measurement).<br><br>
The app is basically "as is.." and no guarantees are given that errors cannot occur. If errors occur or if the app has shortcomings in existing functionality, please report this in bugs on GitHub.<br><br>
Remember that this is an app developed and shared for free with other users. If you were to download and change the app with functionality that others may benefit from, ***please*** submit the changes so that we may be able to include them in future versions.

# Device setup
To setup the light bulbs, you must use the mobile phone app from Wiz to get each individual light bulb into the wifi network. When this is done, and the light bulbs have been assigned an IP address, you do the pairing. This is done according to the manual method, that is, you get a form where you register the IP address and the name you want to give the device. The app then checks whether it can find the device and whether it is the type you want to register. If everything is ok, the device will be in the app.


## DEVICE FUNCTIONALITY
The following device drivers are new and replace the old ones and also have new functionality. Devices on the old device drivers should be moved to the new ones. This is done by erasing the device and detecting it again.
<center>
<table style="background:#cce6ff">
  <tr>
    <th style="width:150px">Device</th>
    <th  style="width:75px">On/Off</th>
    <th  style="width:75px">Dim.</th>
    <th  style="width:75px">Temp.</th>
    <th  style="width:75px">RGB Color</th>
    <th  style="width:75px">Scenery</th>
    <th  style="width:75px">Power mshr.</th>
    <th  style="width:75px">Tested</th>
  </tr>
  <tr>
    <td><b>Dimmable devices<br><i>(wizdimmable)</i></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b></b></td>
    <td style="text-align:center"> </td>
    <td style="text-align:center"><br><b></b></td>
    <td style="text-align:center"> </td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
  </tr>
  <tr>
    <td><b>Full color devices<br><i>(wizcolor)</i></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"> </td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
  </tr>
<tr>
    <td><b>Tuneable white devices<br><i>(wiztuneable)</i></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
  </tr>
<tr>
    <td><b>On/off smartplugg<br><i>(wizonoffplug)</i></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
  </tr>
<tr>
    <td><b>Smartplug w/powermeter<br><i>(wizpowerplug)</i></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
  </tr>
</table></center>
<br><br>
## DOKUMENTATION
Documentation of the WizBulbs app can be found on the website: [https://www.boyum.priv.no/WizWiFi/](https://www.boyum.priv.no/WizWiFi/)
<br><br>
# Remarks
This app is experimental and may therefore contain errors and omissions. The app is not based an official library from Wiz and all use of the app is at your own risk.

# Change log

**1.0.0** First Version of WizWiFi app that replaces the old WizBulb app (WizBulb app is not longer supported) 

**1.0.1** Local Version (bug fix)

**1.0.2** BETA Release version after functional test

**1.0.3** Local Version (bug fix)

**1.0.3** Local Version (bug fix)

**1.0.5** First official release version of the app after testing. 

**1.0.6** Bug fix.

**1.0.7** Corrected logical errors in Devices

**1.1.0** Version submitted to Homey for Certification


# Licens
[MIT](https://github.com)

