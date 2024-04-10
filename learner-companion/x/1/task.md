# Introduction 
In this tutorial we are building a basic CAP application.

This file will automagically update and show you what you need to do in the tutorial.

To activate this, just run `npm run learner-companion` in the terminal and keep this terminal window open to keep it running.
Whenever you save a file, this file will update.

Don't touch anything in the learner-companion folder


# Task

The initial project structure has already been created with `cds init incidents-app`.

Start the learning companion app by running `npm run learner-companion` and keep this terminal window open to keep it running.

In the `db` folder create a file to store the data model for the application.

In the datamodel, we want to create an entity called Customers with the properties firstName and lastName.
The entity should use the aspect cuid, so that every new entry added to customers automatically gets an ID generated.

# Hints

https://cap.cloud.sap/docs/get-started/in-a-nutshell#domain-models

https://cap.cloud.sap/docs/cds/common#common-reuse-aspects

You can import an aspect into your cds file like this: `using { Country } from '@sap/cds/common';`

--> maybe hints can be hidden in the future and user has to write `hint` into the running console to see one at a time??

# Failing Test