// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

import CanvasController from "./canvas_controller"
application.register("canvas", CanvasController)

import HelloController from "./hello_controller"
application.register("hello", HelloController)

import InviteController from "./invite_controller"
application.register("invite", InviteController)

import NoticeController from "./notice_controller"
application.register("notice", NoticeController)
