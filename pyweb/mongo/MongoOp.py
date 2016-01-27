#!/bin/env python
#coding=utf-8

from pymongo import MongoClient
import crazyrobot.apps as apps

db = MongoClient().qq[apps.CrazyrobotConfig.name]

def insertAnswer(content):
    print apps.CrazyrobotConfig.name
    db.insert_one(content)