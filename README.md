# HoloDAO

[![Code Status](https://img.shields.io/badge/Code-Pre--Alpha-orange.svg)](https://github.com/Holochain/dao)
[![In Progress](https://img.shields.io/waffle/label/Holochain/dao/in%20progress.svg)](http://waffle.io/Holochain/dao)
[![Gitter](https://badges.gitter.im/metacurrency/holochain.svg)](https://gitter.im/metacurrency/holochain?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)

**A Holochain implementation of the Ethereum example DAO contract**
As part of our benchmarking for [Holo](http://holo.host) we have built a Holochain version of the sample [DAO contract](https://github.com/Holochain/dao/blob/master/dao.sol) from the Ethereum.org website.

**[Code Status:](https://github.com/metacurrency/holochain/milestones?direction=asc&sort=completeness&state=all)** Pre-alpha. Not for production use. This application has not been audited for any security validation.

## Installation

Prerequiste: [Install holochain](https://github.com/metacurrency/holochain/#installation) on your machine.
You can install HoloDAO very simply with this:

``` shell
hcdev init -cloneExample=dao

```

## Usage

This example has no UI, it's only useful to run from tests.

### Tests
To run all the stand alone tests:

``` shell
hcdev test
```

Currently there is one scenario test:

#### benchmark
``` shell
hcdev -mdns=true scenario benchmark
```
This scenario spins up the owner node and a bunch of member nodes which create and vote on a bunch of proposals.

## Contribute
We welcome pull requests and issue tickets.  Find us on [gitter](https://gitter.im/metacurrency/holochain) to chat.

Contributors to this project are expected to follow our [development protocols & practices](https://github.com/metacurrency/holochain/wiki/Development-Protocols).

## License
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)

Copyright (C) 2017, The MetaCurrency Project (Eric Harris-Braun, Arthur Brock, et. al.)

This program is free software: you can redistribute it and/or modify it under the terms of the license provided in the LICENSE file (GPLv3).  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

**Note:** We are considering other 'looser' licensing options (like MIT license) but at this stage are using GPL while we're getting the matter sorted out.
