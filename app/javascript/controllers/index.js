// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

import CanvasController from "./canvas_controller"
application.register("canvas", CanvasController)

import HelloController from "./hello_controller"
application.register("hello", HelloController)
const application = Application.start()
const context = require.context("controllers", true, /_controller\.js$/)
application.load(definitionsFromContext(context))