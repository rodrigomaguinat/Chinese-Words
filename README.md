# Chinese-Words
To can add new Chinese words from iphone shortcuts to Google Sheets with Apps Scripts

<p align="center">
  <img src="./images/iPhoneShortcuts.png" alt="iPhoneShortcuts" width="250">
</p>

## Steps

### 1. Open Google Sheets
Create a Google Sheets and then select the extension Apps Script

<p align="center">
  <img src="./images/GoogleSheets.png" alt="GoogleSheets" width="450">
</p>

### 2. On Apps Script
Copy code.gs, then click on "Implementar"

<p align="center">
  <img src="./images/Apps Script.png" alt="AppsScript" width="450">
</p>

Select "Nueva Implementacion"

<p align="center">
  <img src="./images/NewImplementation.png" alt="NewImplementation" width="450">
</p>

Finally will appear a window with an URL, we should copy it

### 3. On Shortcuts
Follow this actions and use the URL that we copied 

<p align="center">
  <img src="./images/Shortcuts.png" alt="Shortcuts" width="200">
</p>

🍟The first URL 
* The end of the link should be : ?palabra=<Palabra> ("Palabra" it's a variable on the first action)
* Método → GET

🍟The second URL
* Método → POST.
* “Cuerpo de la solicitud” → Formulario.  
* “Agregar nuevo campo”:  
  * "Clave" → palabra  
  * "Valor" → select your variable "Palabra" 
