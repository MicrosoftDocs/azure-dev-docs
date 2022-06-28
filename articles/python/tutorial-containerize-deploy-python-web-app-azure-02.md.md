title: "Tutorial: Containerized Python web apps on Azure - Build and test locally"
description: Build and test a containerized Python web app locally.
ms.topic: conceptual
ms.date: 06/27/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
---

# Build and test a containerized Python web app locally

In this part of the tutorial, you learn how to containerize a Python web application into a Docker image.

The Docker Explorer lets you examine and manage Docker assets: containers, images, volumes, networks, and container registries. 

Some point to make sure user has a big picture idea of containerizing a web app
	- Look at the  docker-compose.yml
		○ It has the name of the image that will be built.
		○ It links to Dockerfile
	- Goal: You should be able can describe the contents of the Dockerfile and what it does.
	- Goal: Understand tags. Tags are references to Docker imagers and they make it easy to pull and run images by referencing the tags.
	- Docker commands from palette are same as right-click on 
	- Make sure Docker is running. If you click on Docker extension and fail to connect, then check that Docker is running.

## 1. Build a Docker image


## 2. Run the image locally in a container