# frozen_string_literal: true

module Api
  module V1
    class RoomsController < ApplicationController
      def run
        language = params[:language]
        code_content = params[:code]
        uuid = params[:uuid]
        if ENV["RAILS_ENV"] == "production"
          host_ip = "127.0.0.1"
        else
          host_ip = ENV.fetch('HOST_IP', nil)
        end
        username = ENV.fetch('SSH_USER_NAME', nil)
        new_container_name = "#{uuid}-#{language}"
        doc_type = 'main.rb'
        run_type = 'ruby'
        if language == 'JavaScript'
          doc_type = 'main.js'
          run_type = 'node'
        end
        doc_name = "#{new_container_name}-#{doc_type}"
        if host_ip == '127.0.0.1'
          File.write("/home/#{doc_name}", code_content.to_s)
          result = ''
          Net::SSH.start(host_ip, username) do |ssh|
            ssh.exec!("docker cp /home/code/#{doc_name} #{new_container_name}:/root/#{doc_type}")
            result = ssh.exec!("docker exec #{new_container_name} #{run_type} root/#{doc_type}")
          end
          p File.delete("/home/#{doc_name}")
        else
          File.write("../#{doc_name}", code_content.to_s)
          push_code = "cat ../#{doc_name} | ssh #{username}@#{host_ip} '/bin/cat > /home/code/#{doc_name}'"
          p("try translate ...-- #{system push_code}")
          puts 'OK!!'
          result = ''
          Net::SSH.start(host_ip, username) do |ssh|
            ssh.exec!("docker cp /home/code/#{doc_name} #{new_container_name}:/root/#{doc_type}")
            result = ssh.exec!("docker exec #{new_container_name} #{run_type} root/#{doc_type}")
          end
          p File.delete("../#{doc_name}")
        end
       
        
        render json: { result: }
      end
    end
  end
end
