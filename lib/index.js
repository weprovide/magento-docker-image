#!/usr/bin/env node

process.stdout.write(JSON.stringify({
    "version": "2.4.1",
    "php": {
        "version":"7.4",
        "variant":"alpine"
    }
}));