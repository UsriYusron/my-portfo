# Project Blueprint

## Overview

This project is a personal portfolio website built with Next.js. It showcases the user's projects and certificates. The goal is to create a fast, modern, and visually appealing portfolio.

## Implemented Features

*   **Modern Design:** The site uses a clean, modern design with a dark mode option.
*   **Dynamic Content:** The projects and certificates are fetched from a database and displayed dynamically.
*   **Image Optimization:** The `next/image` component is used to optimize images, and the `next.config.mjs` file is configured to allow images from external sources.

## Current Task: Performance Optimization

The user wants to make the website lighter and smoother. I will achieve this by implementing the following optimizations:

*   **Lazy Load Components:** I will use `next/dynamic` to lazy-load the "Certificates" and "Projects" sections on the dashboard pages. This will reduce the initial JavaScript bundle size and improve the perceived performance.
*   **Font Optimization:** I will replace the generic `font-family: Arial, Helvetica, sans-serif;` with a more performant and modern font from Google Fonts, loaded using `@next/font`.
*   **Image Optimization:** I will continue to ensure all images are properly optimized using the `next/image` component.
*   **Code Splitting:** I will analyze the code for opportunities to split it into smaller chunks.
