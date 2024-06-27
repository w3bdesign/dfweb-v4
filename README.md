# Dfweb.no Portfolio Version 4

Third version of my portfolio website with Next.js, Sanity.io and Typescript.

## Live URL: <https://www.dfweb.no>

> ## Frontend
>
<img src="https://private-user-images.githubusercontent.com/45217974/343614850-f9ca1ba0-7e1b-451e-8b46-bfea50aa0280.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTk0NTczMzEsIm5iZiI6MTcxOTQ1NzAzMSwicGF0aCI6Ii80NTIxNzk3NC8zNDM2MTQ4NTAtZjljYTFiYTAtN2UxYi00NTFlLThiNDYtYmZlYTUwYWEwMjgwLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA2MjclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNjI3VDAyNTcxMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWM0OTcwYzJkMWNmOGJjYmQ1MjZmNDRlNDBhNWZjZDY4MGFlYTNhMGU2ZGJlYzViN2U1YTNlMzVjNjhiZmE2MTEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.7kKYcpLf_nXEjV0epgqyYCUuJSqu251dEKLAEhRZkCE" alt="Dfweb screenshot" />

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

- Next.js 14 with Typescript and App directory
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
