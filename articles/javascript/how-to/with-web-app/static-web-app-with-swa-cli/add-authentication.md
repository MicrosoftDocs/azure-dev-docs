---
title: "7-Auth: Add easy authentication"
description: 
ms.topic: how-to
ms.date: 08/27/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---

# 7. Add easy authentication to web app



Add react-router-dom and @types/react-router-dom with npm 

```
cd app && \
npm install react-router-dom @types/react-router-dom --save
```

//stored in new branch

## Create public route

Create components directory
Create `./components/NavBar.tsx`
Create `PublicHome` and move form into it.
Add Routes and `NavBar` to `PublicHome` to `App.tsx`.

## Create private route