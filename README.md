# Dfweb.no Portfolio Version 4

Fourth version of my personal portfolio website with Next.js, Framer Motion, Sanity.io and Typescript.

## Live URL: <https://www.dfweb.no>

> ## Frontend

![343614850-f9ca1ba0-7e1b-451e-8b46-bfea50aa0280](https://github.com/w3bdesign/dfweb-v4/assets/45217974/38d123e1-6667-4d2e-a163-ab8710d637e2)

<br />

> ## Backend
>
> <img src="https://user-images.githubusercontent.com/45217974/163738342-3e8ecc1c-e0d0-4f1d-8fcf-cbbccc31a2d7.png" alt="Sanity backend" />

<br />

> ## Google Lighthouse
>
> <center><img src="https://user-images.githubusercontent.com/45217974/154784575-ec7c0df5-3724-4de0-b8ec-c0ee6ea42f6f.png" alt="Lighthouse score" /></center>

## Features

### General

- Next.js 14 with Typescript
- Sanity.io for fetching project information and frontpage text
- Ladle for component documentation
- Animations with Framer Motion
- React testing library for unit testing
- Cypress for E2E testing
- Contact form with Email.js
- Polymorphic components
- Automatic sitemap generation (see /api/siteMapGenerator.ts)
- Google rich results for each individual page
- 100% score in Google Lighthouse

### Design

- Fully responsive design tested on all devices
- React Icons for project icons
- Tailwind CSS for styling
- Google fonts with Lato (optimized with @next/font for Next.js)
- Animated reusable input fields

### Accessibility

- WCAG accessibility tested
- Accessibility testing with Cypress Axe
- Accessibility testing with Axe in Storybook for each component

### Devops / Code quality

- Continuous Integration with CircleCI
- CircleCI will warn before deploy if tests fail (setup for React testing library, Cypress and Chromatic)
- Code quality analysis with Codacy, Sonarcloud, LGTM and Codeclimate
- E2E testing with Cypress integrated with CircleCI
- E2E testing with Playwright integrated with Github actions
- Unit testing with Jest and React Testing Library integrated with CircleCI
- Test coverage setup with Codecov
- 98% test coverage with Jest and React testing library

## TODO

- React Hook Form
