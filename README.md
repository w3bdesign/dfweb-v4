[![cypress](https://github.com/w3bdesign/dfweb-v4/actions/workflows/cypress.yml/badge.svg)](https://github.com/w3bdesign/dfweb-v4/actions/workflows/cypress.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3e803ad0f17146b78bbed9850eb1461f)](https://app.codacy.com/gh/w3bdesign/dfweb-v4/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![codecov](https://codecov.io/gh/w3bdesign/dfweb-v4/graph/badge.svg?token=AHQW8WQ6U8)](https://codecov.io/gh/w3bdesign/dfweb-v4)
[![Maintainability](https://api.codeclimate.com/v1/badges/8d5cae5017b1a9698843/maintainability)](https://codeclimate.com/github/w3bdesign/dfweb-v4/maintainability)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=w3bdesign_dfweb-v4&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=w3bdesign_dfweb-v4)
 
# 👨‍💻 Dfweb.no Portfolio Version 4

Fourth version of my personal portfolio website with Next.js, Framer Motion, Sanity.io and Typescript.

## 📋 Table of Contents
- Live URL
- Frontend
- Backend
- Google Lighthouse
- Features
  - General
  - Design
  - Accessibility
  - Devops / Code quality

## 🌐 Live URL: <https://www.dfweb.no>

<details>
  <summary>Frontend</summary>
  <img src="https://github.com/user-attachments/assets/958aaa13-0f82-405d-b1d2-ff99588cf7c4" alt="Frontend Image" />
</details>

<details>
  <summary>Backend</summary>
  <img src="https://github.com/user-attachments/assets/67099a89-0cda-458a-9fcd-ab09b016ace4" alt="Backend Image" />
</details>

<details>
  <summary>Google Lighthouse</summary>
  <img src="https://github.com/user-attachments/assets/56616d37-be9f-4459-91f0-6906b189bd1b" alt="Google Lighthouse Image" />
</details>

## 🚀 Features

### 🌟 General

- Clean, modern, responsive and Matrix-inspired design
- Components are 100% typescript
- Matrix canvas rain effect on front page
- Custom 404 page with Matrix rain effect
- Next.js 14 with Typescript and App router
- Sanity.io for all of the content, projects and navigation links
- Ladle for component documentation
- Animations with Framer Motion
- React testing library for unit testing
- Cypress for E2E testing
- Contact form with Email.js
- Polymorphic components
- Automatic sitemap generation (see /api/siteMapGenerator.ts)
- Google rich results for each individual page
- 99% / 100% / 100% / 100% score in Google Lighthouse
- React Hook Form with Typescript and Zod for efficient form handling and validation

### 🎨 Design

- Fully responsive design tested on all devices
- React Icons for project icons
- Tailwind CSS for styling
- Animated reusable input fields

### ♿ Accessibility

- WCAG accessibility tested
- Accessibility testing with Cypress Axe
- Builds will fail if any a11y errors are found

### 🛠️ Devops / Code quality

- Continuous Integration with CircleCI
- CircleCI will warn before deploy if tests fail (setup for React testing library)
- Github action workflow for Cypress
- Code quality analysis with Codacy, Sonarcloud and Codeclimate
- E2E testing with Cypress integrated with Github actions
- E2E testing with Playwright integrated with Github actions
- Unit testing with Jest and React Testing Library integrated with CircleCI
- Test coverage setup with Codecov
- 100% test coverage with Jest and React testing library
