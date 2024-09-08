# Vim Canvas Demo App (React)

![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
 ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Radix UI](https://img.shields.io/badge/radix%20ui-161618.svg?style=for-the-badge&logo=radix-ui&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)

<img src='./vim-canvas-landing.png' width='100%' >

## Quick Links

* [Vim Canvas Docs](https://docs.getvim.com/)
* [VimOS.js Canvas SDK](https://www.npmjs.com/package/vim-os-js-browser)

## What is Vim Canvas?
Vim is the middleware platform for healthcare. Vim Canvas is a self-service platform that empowers application developers to embed their application into Electronic Health Record (EHR) workflows, resulting in a streamlined and low-friction experience for end users. With Vim, you can deploy your applications on top of Vim Connect - Vim's in-EHR connectivity layer - accelerating time to market at reduced cost and improved flexibility. You can leverage Vim's platform to engage with a growing network of 2,000+ provider organizations and 8M+ patients.

# Repo Overview 😎

This repo contains example projects for building applications on top of Vim Canvas.
The applications in different frameworks demonstrates how to use the VimOS.js Canvas SDK to interact with the Vim Canvas platform. The app showcases the following features:

* Authentication with Vim Canvas
* Embedding an application into the Vim Canvas platform
* Viewing EHR entities, including
  * Patients
  * Encounters
  * Referrals
  * Orders
* Updating EHR entities, including
  * Encounters
  * Referrals

## Vim Canvas Demo App (React)

Under the `vim-canvas-demo-app-react` we have a project that uses cloudflare pages to host the Vim Canvas Demo App built with React & also the serverless service needed for the authentication flow.

The app is built with `vite` and `react` and uses `shadcn`, `radix-ui`,`tailwindcss` for the UI components.

### Folder Structure

* `functions` - Contains [cloudflare pages functions](https://developers.cloudflare.com/pages/functions/) for the authentication flow.
* `src/components/ui` - Contains UI components generated with [Shadcn](https://ui.shadcn.com/).
* `src/hooks` - Contains custom hooks for the application, including hooks that wrap the VimOS.js Canvas SDK - [following the docs examples](https://docs.getvim.com/vim-os-js/reactjs.html#react-integration-guide-for-vimos.js).

## Running the example code

### Prerequisites
In order to see the demo code in action, you must first configure an application in the [Vim Canvas Developer Platform](https://console.getvim.com/organization-admin/).

If you don’t have a Vim Canvas developer account yet, register [here](https://getvim.com/vim-canvas-developer-platform/) to gain access.

### Installation

To install and run the app locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/getvim/vim-canvas-demo-app.git
```

2. Navigate to the project directory:

```bash
cd vim-canvas-demo-app-react
```

3. Install the dependencies:

```bash
npm install
```

4. Create a `.dev.vars` file with the following content:

```.env
CLIENT_ID=<<YOU ACCOUNT CLIENT ID>>
CLIENT_SECRET=<<YOUR ACCOUNT CLIENT SECRET>>
```

5. Change the `appUrl` in `functions/api/launch.ts` to `"http://localhost:8788"` (the local app url).

6. Start the development server:

```bash
npm run dev
```

7. Follow up on [Testing Your Application](https://docs.getvim.com/platform/testing.html#testing-your-application) in the official docs

## Authentication Flow

The `functions` folder is a cloudflare pages function that handles the authentication flow for the app.

When running locally the api server starts at `http://localhost:8788` & exposes the following endpoints:
* `/api/launch` - This endpoint is used to initiate the authentication flow.
* `/api/token` - This endpoint is used to handle the callback from the Vim Canvas platform to create a token.
