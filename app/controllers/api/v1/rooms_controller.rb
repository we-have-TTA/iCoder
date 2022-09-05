class Api::V1::RoomsController < ApplicationController
  def run
    host_ip = ENV.fetch('HOST_IP', nil)
    username = ENV.fetch('SSH_USER_NAME', nil)
    
    # new_container_name = "#{uuid}-#{language}"
    # render json: {params: params}
    File.write("../#{current_user.id}-main.rb", "#{params[:code]}")
    push_code = "cat ../#{current_user.id}-main.rb | ssh #{ENV.fetch('SSH_USER_NAME', nil)}@#{ENV.fetch('HOST_IP', nil)} -p 5000 '/bin/cat > /root/main.rb'"
    run_code = "ssh #{ENV.fetch('SSH_USER_NAME', nil)}@#{ENV.fetch('HOST_IP', nil)} -p 5000 'ruby /root/main.rb'"
    
    p("try build ...-- #{system push_code}")
    p session[:current_language]
    p File.delete("/Users/rexkao/Project/iCoder_dev/#{current_user.id}-main.rb")
    # p("try run ...-- #{system run_code}")
    puts 'OK!!'
    result= ""
    Net::SSH.start("139.59.99.186", username, password: "8888") do |ssh|
      result = ssh.exec!("docker exec test-ruby ruby root/main.rb")
    end
    render json: { result: result }
  end
end
