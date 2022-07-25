# Automated Translation (Custom)

This is a prototype implementation of the necessary endpoints for the Automated Translation feature in BOTfriends X. This implementation refers to the provider type ```Custom```.


## Get Started

### Installation

``` shell
npm install
```

### Usage in development mode

``` shell
npm run dev
```

### Build for production mode

``` shell
npm run build
```

### Usage in production mode

``` shell
npm start
```

## Project Structure

### Overview

| Component | Function |
| ------ | --------------- |
| ```dist``` | Contains all production files. |
| ```src``` | Contains all of the server files. |
| ```.eslintrc.js``` | Contains ESlint configuration. |
| ```.gitignore``` | Contains files ignored by git. |
| ```nodemon.json``` | Contains hot reload development server configuration. |
| ```package.json``` | Keeps track of dependencies. |
| ```tsconfig.json``` | Contains Typescript configuration. |

---

### Overview for /src

| Component | Function |
| ------ | --------------- |
| ```/controllers``` | Contains the ```AutomatedTranslationController```, which processes and responds to incoming request. |
| ```/services``` | Contains the ```AutomatedTranslationService```, which is called by the ```AutomatedTranslationController``` and a ```MockTranslationService```, which is supposed to imitate a translation API (e.g. Google).  |
| ```/interfaces``` | Contains the descriptions of the received dtos sent by BOTfriends X. |
| ```app.ts``` | Contains the configuration of the Express Server. |
| ```server.ts``` | Starts the Express Server. |
| ```routes.ts``` | Contains the two routes that are needed for the incoming and outgoing translation.  |
---

## Brief Explanation

The ```AutomatedTranslationController``` contains the functionality to perform an incoming translation (```handleIncomingTranslation```) and an outgoing translation (```handleOutgoingTranslation```). 

| Routes | Function |
| ------ | --------------- |
| ```POST /api/v1/incoming-translation``` | Calls ```handleIncomingTranslation``` |
| ```POST /api/v1/outgoing-translation``` | Calls ```handleOutgoingTranslation``` |
---

### Description of ```handleIncomingTranslation```

The incoming translation can be used to manipulate a user message or the language before an intent detection takes place. This can be done based on the following DTO sent by BOTfriends X:

```ts
{
  recipient: string
  channel: string
  projectLanguages: string[]
  defaultLanguage: string
  originalLanguage: string
  languageCode: string
  message: {
    type: 'text' | 'file' | 'event'
    input: string
  }
}
```

The ```AutomatedTranslationController``` receives this dto and calls the ```AutomatedTranslationService.handleIncomingTranslation(dto)```, which can perform manipulations on the DTO. The ```AutomatedTranslationService``` performs several property overrides on that dto and returns it. It is important to know, that only the following properties can be overriden: 
* ```languageCode```: Can be set to the language for which intent detection is to be performed
* ``originalLanguage``: Can be set to the actual user language, this is transmitted again with the outgoing translation
* ```message.input.text```: Can be set to the translated user input

In our prototypical implementation the ```AutomatedTranslationService``` does a language detection (static map from strings to languageCode) with the help of the ```MockTranslationService.detectLanguage```. This step can be avoided by using the language detection of BOTfriends X. Then the detected language of the Google Language Detection can be found in ```incomingTranslationDto.originalLanguage```. If the detected language is different from the used language (```incoingTranslationDto.languageCode```) and the detected language is not present in the project languages (```incomingTranslationDto.projectLanguages```) a translation of the user input into one of the project languages must be performed. In our example this is done with the help of the ```MockTranslationService.translate```. In the last step the necessary properties of the DTO must be overwritten. 

### Description of ```handleOutgoingTranslation```

The outgoing translation can be used to can be used to retranslate outgoing responses before sending them to the use. This can be done based on the following DTO sent by BOTfriends X:

```ts
{
  recipient: string
  channel: string
  projectLanguages: string[]
  defaultLanguage: string
  originalLanguage: string
  languageCode: string
  outputs: Output []
}
```

The ```AutomatedTranslationController``` receives this dto calls the ```AutomatedTranslationService.handleOutgoingTranslation```, which can perform manipulations on the DTO. The ```AutomatedTranslationService``` performs several property overrides of the dto and returns it. It is important to know, that only the following properties can be overriden: 
* ```outputs```: Can be set an array of translated outputs

In our prototypical implementation we check if the language of the intent detection (```outgoingTranslationDto.languageCode```) is different from the actual user language (```outgoingTranslationDto.originalLanguage```). These two properties were previously set via ```AutoatedTranslationService.handleIncomingTranslation```. If this is the case, the individual bot responses can be translated back into the user's language. Since the outputs are an array of objects, a loop over all objects and separate translator for each output type must be implemented. In the ```MockTranslationService``` this was prototypically implemented with the method ```translateOutputs```. This method is not fully implemented and currently only works only text messages (see ```translateTextMessage```). In the last step the necessary properties of the DTO must be overwritten. 

---

## Authors

[**BOTfriends GmbH**](https://botfriends.de)
