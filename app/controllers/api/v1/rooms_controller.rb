# frozen_string_literal: true

module Api
  module V1
    class RoomsController < ApplicationController
      DOC_TYPE_SET = {
        ruby: 'main.rb',
        javascript: 'main.js',
        python: 'main.py',
        elixir: 'main.ex'
      }.freeze
      RUN_TYPE_SET = {
        ruby: 'ruby',
        javascript: 'node',
        python: 'python',
        elixir: 'elixir'
      }.freeze

      def run
        language = params[:language]
        code_content = params[:code]
        uuid = params[:uuid]
        host_ip = ENV.fetch('HOST_IP', nil)
        host_ip = '127.0.0.1' if ENV['RAILS_ENV'] == 'production'
        username = ENV.fetch('SSH_USER_NAME', nil)
        new_container_name = "#{uuid}-#{language}"
        doc_type = DOC_TYPE_SET[language.downcase.to_sym]
        run_type = RUN_TYPE_SET[language.downcase.to_sym]
        doc_name = "#{new_container_name}-#{doc_type}"
        if ENV['RAILS_ENV'] == 'production'
          File.write("/home/#{doc_name}", code_content.to_s)
          result = ''
          Net::SSH.start(host_ip, username) do |ssh|
            ssh.exec!("docker cp /home/#{doc_name} #{new_container_name}:/root/#{doc_type}")
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

      def catch_questions
        render json: { question: Question.where(team: current_user.team), team: current_user.team, user: User.all }
      end

      def change_roomtitle
        # params.input.update(params_input)
        room = Room.find(params[:id])
        if room.update(title: params_input[:input])
          render json: { messages: 'ok' }
        else
          render json: { messages: 'notok' }
        end
      end

      private

      def params_input
        params.permit(:input, :id)
      end
    end
  end
end
