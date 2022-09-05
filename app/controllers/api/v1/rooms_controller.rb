class Api::V1::RoomsController < ApplicationController
  def run
    language = params[:language]
    code_content = params[:code]
    uuid = params[:uuid]
    host_ip = ENV.fetch('HOST_IP', nil)
    username = ENV.fetch('SSH_USER_NAME', nil)
    new_container_name = "#{uuid}-#{language}"
    doc_type = "main.rb"
    run_type = "ruby"
    if language === "JavaScript"
      doc_type = "main.js"
      run_type = "node"
    end
    doc_name = "#{new_container_name}-#{doc_type}"
    File.write("../#{ doc_name }", "#{ code_content }")
    push_code = "cat ../#{ doc_name } | ssh #{ username }@#{ host_ip } '/bin/cat > /home/code/#{ doc_name }'"
    p("try translate ...-- #{system push_code}")
    p File.delete("../#{ doc_name }")
    puts 'OK!!'
    result= ""
    Net::SSH.start(host_ip, username) do |ssh|
      ssh.exec!("docker cp /home/code/#{ doc_name } #{ new_container_name }:/root/#{ doc_type }")
      result = ssh.exec!("docker exec #{ new_container_name } #{ run_type } root/#{ doc_type }")
    end
    render json: { result: result }
  end
end
