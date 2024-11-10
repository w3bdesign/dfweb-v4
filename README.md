[![cypress](https://github.com/w3bdesign/dfweb-v4/actions/workflows/cypress.yml/badge.svg)](https://github.com/w3bdesign/dfweb-v4/actions/workflows/cypress.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3e803ad0f17146b78bbed9850eb1461f)](https://app.codacy.com/gh/w3bdesign/dfweb-v4/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![codecov](https://codecov.io/gh/w3bdesign/dfweb-v4/graph/badge.svg?token=AHQW8WQ6U8)](https://codecov.io/gh/w3bdesign/dfweb-v4)
[![Maintainability](https://api.codeclimate.com/v1/badges/8d5cae5017b1a9698843/maintainability)](https://codeclimate.com/github/w3bdesign/dfweb-v4/maintainability)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=w3bdesign_dfweb-v4&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=w3bdesign_dfweb-v4)
 
# Dfweb.no Portfolio Version 4

Fourth version of my personal portfolio website with Next.js, Framer Motion, Sanity.io and Typescript.

## Table of Contents
- [Live URL](#live-url)
- [Frontend](#frontend)
- [Backend](#backend)
- [Google Lighthouse](#google-lighthouse)
- [Features](#features)
  - [General](#general)
  - [Design](#design)
  - [Accessibility](#accessibility)
  - [Devops and Code quality](#devops-and-code-quality)

## Live URL

<https://www.dfweb.no/>

## Frontend (Next.js)

<img src="/public/images/frontend.png" alt="Frontend Image" />

* * *

## Backend (Sanity headless CMS)

<img src="https://github.com/user-attachments/assets/67099a89-0cda-458a-9fcd-ab09b016ace4" alt="Backend Image" />

* * *

## Google Lighthouse

![image](https://github.com/user-attachments/assets/418aa995-1913-4946-b6f8-5ca8eb9d07a5)

## Features

### General

- Clean, modern, responsive and Matrix-inspired design
- The application is 100% typescript
- Matrix canvas rain effect on front page
- Custom 404 page with Matrix rain effect
- Next.js 15 with Typescript and App router
- Sanity headless cms for all of the content, projects and navigation links
- Ladle for component documentation
- Animations with Framer Motion
- React testing library for unit testing
- Cypress for E2E testing
- Playwright for cross-browser E2E testing
- Contact form with Email.js
- Polymorphic components
- Automatic sitemap generation (see /api/siteMapGenerator.ts)
- Google rich results for each individual page
- 100% / 100% / 100% / 100% score in Google Lighthouse
- React Hook Form with Typescript and Zod for efficient form handling and validation
- Reusable GenericForm component for easy form creation and management
- Error handling with react-error-boundary for improved user experience and easier debugging

### Design

- Fully responsive design tested on all devices
- React Icons for project icons
- Tailwind CSS for styling
- Animated reusable input fields
- Matrix-inspired animated cursor with dynamic trailing effect with fading Matrix characters
 

### Accessibility

- WCAG accessibility tested
- Accessibility testing with Cypress Axe
- Builds will fail if any a11y errors are found

### Devops and Code quality

- Continuous Integration with CircleCI
- CircleCI will warn before deploy if tests fail (setup for React testing library)
- Github action workflow for Cypress
- Code quality analysis with Codacy, Sonarcloud and Codeclimate
- E2E testing with Cypress integrated with Github actions
- E2E testing with Playwright for cross-browser compatibility, integrated with Github actions
- Unit testing with Jest and React Testing Library integrated with CircleCI
- Test coverage setup with Codecov
- 100% test coverage with Jest and React testing library
