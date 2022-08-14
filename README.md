# Remix Electro Stack

![](https://www.wallpaperup.com/uploads/wallpapers/2016/06/09/980773/a3a1170249387ca3657121777aba7041.jpg)

This repo aims to provide developers with a Remix-based template inspired from official ones, but based on Material-UI and Supabase for no password Auth, and serverless Cloud Database (PostgreSQL) management.
Deployment on Vercel.

## Setup

You will need 3 accounts:

1. Source Provider (Github, Gitlab, ...) to host your customised repository,
2. Vercel for deployments
3. Supabase for Auth & Database management

How to setup Supabase : refer to this [README](https://github.com/one-aalam/remix-starter-kit#how-to-setup-supabase-for-remix-starter-kit).

## Deployment

After having run the `create-remix` command and selected "Vercel" as a deployment target, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).

## Development

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
npm install
```

Afterwards, start the Remix development server like so:

```sh
npm run dev
```

Note: you can run this script in VSCode's integrated "Javascript Debug terminal" to be able to use breakpoints ;)

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

## Resources

[Remix Starter Kit](https://github.com/one-aalam/remix-starter-kit)

[Bare minimum authentication with Remix (including Social Providers)](https://github.com/arpitdalal/remix-supabase-auth)

[Remix and Database integration @ Supabase](https://dev.to/codegino/remix-and-supabase-integration-cci#preface)

[Supabase Project Dashboard](https://app.supabase.io/project) (append it with your project's ID)

[Vercel Deployments Dashboard](https://vercel.com/sharlaan/electro-stack/deployments)

[Remix Docs](https://remix.run/docs)

[How to use translations in Remix](https://dev.to/adrai/how-to-internationalize-a-remix-application-2bep)

[Designer Adam Argyle's excellent repo](https://github.com/argyleink/gui-challenges) containing a few CSS-only well-thought components.
