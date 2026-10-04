export type Episode = {
  id: string;
  order: number;
  title: string;
  goal: string;
  duration: number;
  lead: string;
  sections: { heading: string; body: string }[];
  callout?: string;
  takeaway: string;
  teachingScript: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  topic: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  episodes: Episode[];
};

export const demoCourse: Course = {
  id: "docker-for-beginners",
  title: "Docker for Beginners",
  description:
    "A calm, practical introduction to containers, images, and the mental models that make Docker click.",
  topic: "Docker",
  level: "Beginner",
  episodes: [
    {
      id: "why-docker-exists",
      order: 1,
      title: "Why Docker Exists",
      goal: "Understand the problem Docker is designed to solve.",
      duration: 8,
      lead:
        "Before learning Docker commands, start with the problem. Docker becomes much easier once you understand why containers are useful in the first place.",
      sections: [
        {
          heading: "The problem: “it works on my machine”",
          body:
            "An application depends on more than its source code. It may need a particular runtime, system libraries, environment variables, and supporting services. Two computers can have the same repository and still produce different results.",
        },
        {
          heading: "A more predictable environment",
          body:
            "Docker gives an application a packaged environment with the pieces it needs to run. Instead of asking another person to recreate your machine, you describe the environment and let Docker create it.",
        },
        {
          heading: "The mental model",
          body:
            "Think of Docker as a way to package an application and its runtime assumptions into something that can be moved and started consistently. The goal is repeatability, not magic.",
        },
      ],
      callout:
        "A useful question to keep in mind: “What does this application assume about the machine it runs on?” Docker is largely about making those assumptions explicit.",
      takeaway:
        "Docker helps make an application's runtime environment more predictable and portable.",
      teachingScript:
        "Before we touch a Docker command, let's talk about why Docker exists. Imagine you build an application on your laptop. It works perfectly. Then a teammate clones the same project, and somehow it breaks. The code is the same, but the environment isn't. Docker is a way of making that environment explicit and portable. Once that mental model clicks, the rest of Docker starts to feel much less mysterious.",
    },
    {
      id: "what-is-a-container",
      order: 2,
      title: "What Is a Container?",
      goal: "Build the right mental model for a running container.",
      duration: 7,
      lead:
        "A container is an isolated process with the files, configuration, and dependencies it needs to run. It is not a tiny virtual machine.",
      sections: [
        {
          heading: "Container vs. virtual machine",
          body:
            "A virtual machine emulates an entire computer environment. A container shares the host operating system kernel while isolating a process and its filesystem, network, and other resources.",
        },
        {
          heading: "Why containers feel lightweight",
          body:
            "Because containers do not each boot a full guest operating system, they can start quickly and use fewer resources than traditional virtual machines for many workloads.",
        },
        {
          heading: "A container is an instance",
          body:
            "An image is a packaged template. A container is a running instance created from that image. Keeping those two ideas separate will save you a lot of confusion later.",
        },
      ],
      callout:
        "Try this sentence: an image is what you package; a container is what you run.",
      takeaway:
        "A container is a running, isolated process created from an image.",
      teachingScript:
        "Here's the easiest way to think about a container. It is not a miniature computer. It is a running process with its own isolated environment. And this gives us an important distinction: an image is the packaged template, while a container is the running instance. You can create multiple containers from the same image, just like you can make several identical things from the same recipe.",
    },
    {
      id: "images-vs-containers",
      order: 3,
      title: "Images vs. Containers",
      goal: "Understand the relationship between an image and a running container.",
      duration: 8,
      lead:
        "Once you understand images and containers as separate concepts, Docker's workflow becomes much easier to reason about.",
      sections: [
        {
          heading: "An image is a blueprint",
          body:
            "An image contains the filesystem and metadata Docker needs to create a container. It is designed to be reused and is typically immutable once built.",
        },
        {
          heading: "A container is a running copy",
          body:
            "When Docker starts a container from an image, it creates a runnable environment with a writable layer on top of the image's contents.",
        },
        {
          heading: "Why the distinction matters",
          body:
            "You build images, pull images, and share images. You start, stop, inspect, and remove containers. The commands become easier once you know which object you are operating on.",
        },
      ],
      callout:
        "Recipe → image. Cake → container. The analogy is not perfect, but it is useful for remembering the relationship.",
      takeaway:
        "Images are reusable package templates; containers are running instances of those images.",
      teachingScript:
        "Let's separate two words that beginners often mix up: image and container. Think of an image as a recipe or blueprint. It describes what should be inside. A container is the thing you actually run. So you build or download an image, and then you create a container from it. That one distinction makes a huge part of Docker's vocabulary suddenly much easier.",
    },
    {
      id: "dockerfile",
      order: 4,
      title: "Dockerfile",
      goal: "Understand how a Dockerfile describes the steps used to build an image.",
      duration: 9,
      lead:
        "A Dockerfile is a small, declarative recipe that tells Docker how to assemble an image.",
      sections: [
        {
          heading: "Start from a base",
          body:
            "A Dockerfile usually starts from an existing base image. That gives your application a known starting point instead of making you build every dependency from scratch.",
        },
        {
          heading: "Add the application",
          body:
            "You then copy files, install dependencies, configure defaults, and describe the command that should run when a container starts.",
        },
        {
          heading: "Build once, run many times",
          body:
            "The point is to capture the build process as code. That makes the resulting image easier to reproduce, review, and share.",
        },
      ],
      callout:
        "The Dockerfile is not the container. It is the recipe used to build the image that can later produce containers.",
      takeaway:
        "A Dockerfile describes how to build a repeatable application image.",
      teachingScript:
        "A Dockerfile is basically a recipe for building an image. You choose a starting point, add your application and dependencies, configure the environment, and define the command to run. The useful part is that the build instructions live in code. So instead of saying, ‘install these seven things and remember this setup,’ you can describe the setup and rebuild it consistently.",
    },
    {
      id: "running-containers",
      order: 5,
      title: "Running Containers",
      goal: "Understand the basic lifecycle of a container.",
      duration: 7,
      lead:
        "Starting a container is only one part of the workflow. You also need to understand how containers are inspected, stopped, and removed.",
      sections: [
        {
          heading: "Start",
          body:
            "Docker creates a container from an image and starts the process defined by that image's configuration.",
        },
        {
          heading: "Inspect",
          body:
            "When something behaves unexpectedly, inspect the container: its status, logs, environment, network settings, and mounted files are often more useful than guessing.",
        },
        {
          heading: "Stop and remove",
          body:
            "Containers are disposable by design. Learn to stop a container cleanly and remove it when you no longer need it.",
        },
      ],
      takeaway:
        "Treat containers as manageable, disposable runtime instances instead of permanent machines.",
      teachingScript:
        "Once you have an image, you can run a container from it. But real Docker work is not just about starting things. You will inspect containers, read logs, stop them, restart them, and eventually remove them. That disposable mindset is important: a container is a runtime instance, not a precious little server that you need to protect forever.",
    },
    {
      id: "volumes",
      order: 6,
      title: "Volumes & Persistent Data",
      goal: "Understand what happens to data when containers are replaced.",
      duration: 8,
      lead:
        "Containers are disposable, but your data often is not. Volumes provide a durable place for data that should outlive an individual container.",
      sections: [
        {
          heading: "The persistence problem",
          body:
            "If an application writes important data only inside a container's writable layer, replacing that container can also replace the data with it.",
        },
        {
          heading: "Volumes",
          body:
            "A volume gives Docker-managed storage that can be mounted into a container. The application can write to the mounted path while the data remains independent from the container lifecycle.",
        },
        {
          heading: "Design question",
          body:
            "Whenever you containerize a stateful service, ask which data is application state and which data is disposable runtime state.",
        },
      ],
      takeaway:
        "Use persistent storage for data that should survive container replacement.",
      teachingScript:
        "Here's one of the most important practical questions in Docker: what happens to my data when I replace the container? Containers are designed to be disposable, but databases and uploaded files usually are not. A volume gives you storage that exists outside the container's own lifecycle. So the application can still read and write data, while the data survives when the container is recreated.",
    },
    {
      id: "networking",
      order: 7,
      title: "Networking",
      goal: "Understand how containers communicate with each other and the outside world.",
      duration: 9,
      lead:
        "Container networking becomes much simpler when you think in terms of processes, interfaces, and names rather than machines.",
      sections: [
        {
          heading: "Containers need to talk",
          body:
            "A web application may need to reach a database, cache, or another service. Docker networks give containers a way to communicate in a controlled environment.",
        },
        {
          heading: "Service names",
          body:
            "In common Docker setups, containers on the same network can discover each other using names instead of hard-coding a changing IP address.",
        },
        {
          heading: "Ports",
          body:
            "A container can listen on a port internally while the host exposes that service on a host port. Keeping those two concepts separate helps avoid many beginner mistakes.",
        },
      ],
      takeaway:
        "Docker networking connects isolated processes while keeping service discovery and port exposure explicit.",
      teachingScript:
        "Containers are isolated, but applications still need to communicate. A web app may need a database, for example. Docker networks provide that connection. One helpful detail is that services can usually talk to each other by name instead of relying on an IP address that might change. Then you have ports, which are about exposing a service to the host or outside world. Once you separate those ideas, Docker networking becomes less scary.",
    },
    {
      id: "docker-compose",
      order: 8,
      title: "Docker Compose",
      goal: "Put multiple services together into a repeatable local environment.",
      duration: 8,
      lead:
        "Real applications often need more than one container. Compose lets you describe those services and their relationships as a single project.",
      sections: [
        {
          heading: "More than one container",
          body:
            "A modern app might have a frontend, API server, database, and cache. Managing each container separately quickly becomes tedious.",
        },
        {
          heading: "Describe the stack",
          body:
            "A Compose file defines services, networks, volumes, environment values, and other relationships so the environment can be recreated from configuration.",
        },
        {
          heading: "The bigger idea",
          body:
            "Compose turns a pile of commands into a readable project definition. That is useful for local development, demos, onboarding, and repeatable environments.",
        },
      ],
      takeaway:
        "Compose lets you describe a multi-container application as one reproducible environment.",
      teachingScript:
        "So far, we've mostly talked about one container at a time. Real projects often have several services: maybe an API, a database, and a cache. Docker Compose lets you describe that whole stack in one configuration file. Instead of remembering a long sequence of commands, you describe the relationships once and bring the environment up as a unit. That's where Docker starts to feel genuinely useful in day-to-day development.",
    },
  ],
};

export function getEpisode(courseId: string, episodeId: string) {
  if (courseId !== demoCourse.id) return undefined;
  return demoCourse.episodes.find((episode) => episode.id === episodeId);
}
