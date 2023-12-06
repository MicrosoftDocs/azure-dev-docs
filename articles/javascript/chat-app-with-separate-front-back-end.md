---
title: 
description: 
ms.date: 12/06/2023
ms.topic: get-started
ms.custom: devx-track-js, devx-track-python, devx-track-js-ai, devx-track-js
# CustomerIntent: As a JavaScript developer new to Azure OpenAI, I want deploy and use sample code to interact with chat app infused with my own business data so that learn from the sample code.

#design suggestions:
# BE returns questions for cards
# AZD outputs BE and FE URLs - postdeploy hook for now
# Deconstruct the BE and FE bicep files so can deploy separately
---

# Get started with the JavaScript enterprise chat sample using RAG


Steps:
Deploy JS repo
Deploy PY repo

azd auth login
azd up

in JS project, get frontend URL with command
open PY backend and run ALLOWED_ORIGIN 
deploy py backend

in PY project, get backend URL with command
open JS frontend and run BACKEND_URI
deploy JS frontend

