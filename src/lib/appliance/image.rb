require 'tempfile'
require 'open-uri'
require 'digest'
require 'systemu'

class Appliance
    class Image
        attr_reader :name, :type, :dev_prefix, :driver, :url, :size, :checksum

        def initialize(data=nil)
            @name = nil
            @type = nil
            @dev_prefix = nil
            @driver = nil
            @url = nil
            @size = nil
            @checksum = nil
            self.from_h(data) unless data.nil?
        end

        def name=(value)
            @name = strip_or_nil(value)
        end

        def type=(value)
            @type = strip_or_nil(value)
        end

        def dev_prefix=(value)
            @dev_prefix = strip_or_nil(value)
        end

        def driver=(value)
            @driver = strip_or_nil(value)
        end

        def url=(value)
            @url = strip_or_nil(value)
        end

        def size=(value)
            @size = value.nil? ? value : value.to_i
        end

        def checksum=(value)
            if value.nil?
                @checksum = value
            elsif value.is_a? Hash
                value.each_pair { |type, digest|
                    self.set_checksum(type, digest)
                }
            else
                raise "Checksum is not Hash"
            end
        end

        def set_checksum(type, digest)
            @checksum = {} if @checksum.nil?
            if digest.nil? or digest.empty?
                @checksum.delete(type)
                @checksum = nil if @checksum.empty?
            else
                @checksum[type.downcase.strip] = digest.strip
            end
        end

        ###

        def from_h(data)
            %w(name type dev_prefix driver url size checksum).each { |k|
                self.send("#{k}=", data[k])
            }
        end

        def from_options(options)
            %w(name type dev_prefix driver url size).each { |opt|
                opt_name = "image_#{opt.to_sym}".to_sym
                self.send("#{opt}=", options[opt_name]) if options.key?(opt_name)
            }

            if options[:image_checksum]
                if options[:image_checksum_type]
                    self.set_checksum(
                        options[:image_checksum_type],
                        options[:image_checksum]
                    )
                else
                    raise "Image checksum type needed"
                end
            end

            if options[:image_refresh]
                self.refresh
            end
        end

        def to_h(legacy=false)
            data = {
                'name'          => @name,
                'url'           => @url,
                'type'          => @type,
                'dev_prefix'    => @dev_prefix,
                'driver'        => @driver,
                'size'          => @size,
                'checksum'      => @checksum
            }

            if legacy and !@checksum.nil? and @checksum.key?('md5')
                data['md5'] = @checksum['md5']
            end

            # remove undefined entries
            data.delete_if { |k, v| v.nil?  }
        end

        def refresh
            Tempfile.open('tmp') do |file|
                # download the file
                URI.parse(@url).open('rb') do |l|
                    file.write(l.read)
                end

                file.close

                # refresh
                @checksum = {
                    'md5'    => Digest::MD5.file(file.path).hexdigest,
                    'sha256' => Digest::SHA256.file(file.path).hexdigest
                }

                @size = get_size(file.path)
            end
        end

        def get_size(file)
            size = nil
            Tempfile.open("tmp") { |unpacked|
                unpacked.close

                # decompress
                type = exec("file --mime-type -b #{file}").strip
                if type == 'application/x-gzip'
                    exec("gunzip -d <#{file} >#{unpacked.path}")
                    file = unpacked.path #TODO
                elsif type == 'application/x-bzip2'
                    exec("bzip2 -d <#{file} >#{unpacked.path}")
                    file = unpacked.path #TODO
                elsif type == 'application/x-xz'
                    exec("xz -d <#{file} >#{unpacked.path}")
                    file = unpacked.path #TODO
                end

                # unarchive
                type = exec("file --mime-type -b #{file}").strip
                Dir.mktmpdir { |unpacked_dir|
                    if type == "application/x-tar"
                        exec("tar -xf #{file} -C #{unpacked_dir}")
                    elsif type == "application/zip"
                        exec("unzip -d #{unpacked_dir} #{file}")
                    end

                    Dir.glob("#{unpacked_dir}/**/*") { |unpacked_file|
                        # get first file in archive
                        if File.file?(unpacked_file)
                            file = unpacked_file
                            break
                        end
                    }

                    cmd = "qemu-img info --output=json #{file}"
                    size = JSON.parse(exec(cmd))['virtual-size']
                    # TODO: driver?
                }
            }

            size
        end

        private
        def exec(command)
            status, stdout, stderr = systemu command
            if status.success?
                stdout
            else
                raise stderr
            end
        end

        private
        def strip_or_nil(value)
            if value.nil?
                value
            else
                value.strip
            end
        end
    end
end

# vim: ai ts=4 sts=4 et sw=4 ft=ruby
