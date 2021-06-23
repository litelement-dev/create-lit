# Contributing to Create lit

Loving Create lit and want to get involved? Thanks! There are plenty of ways you can help.

Please take a moment to review this document in order to make the contribution process straightforward and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue or assessing patches and features.

## Core Ideas

As much as possible, we try to avoid adding configuration and flags. The purpose of this tool is to provide the best experience for people getting started with `lit`, and this will always be our first priority. This means that sometimes we [sacrifice additional functionality](https://gettingreal.37signals.com/ch05_Half_Not_Half_Assed.php) (such as server rendering) because it is too hard to solve it in a way that wouldn’t require any configuration.

We prefer **convention, heuristics, or interactivity** over configuration.<br>
Here are a few examples of them in action.

### Convention

Instead of letting the user specify the entry filename, we always assume it to be `src/lit-app.ts`. Rather than letting the user specify the output bundle name, we generate it, but make sure to include the content hash in it. Whenever possible, we want to leverage convention to make good choices for the user, especially in cases where it’s easy to misconfigure something.

### Heuristics

Normally, `npm run dev` runs on port `3000`, and this is not explicitly configurable. Create Lit reads `PORT` environment variable and prefers it when it is specified in `production-template`. The trick is that we know cloud IDEs already specify it automatically, so there is no need for the user to do anything. Create Lit relies on heuristics to do the right thing depending on environment.

### Interactivity

We prefer to add interactivity to the command line interface rather than add configuration flags. For example, `npm run dev` will attempt to run with port `3000` by default, but it may be busy. Many other tools fail. if the port is already being used, `Vite` will automatically try the next available port so this may not be the actual port the server ends up listening on.

### Breaking the Rules

No rules are perfect. Sometimes we may introduce flags or configuration if we believe the value is high enough to justify the complexity. For example, we know that apps may be hosted paths different from the root, and we need to support this use case. However, we still try to fall back to heuristics when possible.

## Submitting a Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope for Create Lit. Generally always have a related issue with discussions for whatever you are including.

Please also provide a **test plan**, i.e. specify how you verified that your addition works.