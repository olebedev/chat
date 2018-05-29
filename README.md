# Chat
> an example application using [SwarmDB](https://github.com/gritzko/swarm) as a data-sync layer 

### Run locally

Setup the project.

```bash
$ git clone git@github.com:olebedev/chat.git ./SwarmChat
$ cd ./SwarmChat
$ yarn
$ docker run -d --name swarmdb -p 31415:31415 -v `pwd`:/var/lib/swarm olebedev/swarmdb
```

Start web application by hitting `yarn start:web`. Or use [this](https://facebook.github.io/react-native/docs/running-on-device.html) tutorial to run on mobile device.