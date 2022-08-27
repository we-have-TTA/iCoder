import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"
import "controllers"

Rails.start()
Turbolinks.start()
ActiveStorage.start()

import "controllers"
import "stylesheets"
import "../application.css"
