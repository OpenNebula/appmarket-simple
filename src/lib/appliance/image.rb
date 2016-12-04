require 'tempfile'
require 'open-uri'
require 'digest'
require 'systemu'

class Appliance
    class Image
        def initialize(data=nil)
            @type = nil
            @dev_prefix = nil
            @driver = nil
            @location = nil
            @size = nil
            @checksum = nil
            self.from_h(data) unless data.nil?
        end

        def from_h(data)
            %w(type dev_prefix driver location size checksum).each { |k|
                self.instance_variable_set("@#{k}", data[k])
            }
        end
        
        def to_h(legacy=false)
            data = {
                'type'          => @type,
                'dev_prefix'    => @dev_prefix,
                'driver'        => @driver,
                'location'      => @location,
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
            Tempfile.open("tmp") { |file|
                # download the file
                open(@location, "rb") { |l|
                    file.write(l.read)
                }
                file.close

                # refresh
                @checksum = {
                    'md5'    => Digest::MD5.file(file.path).hexdigest,
                    'sha256' => Digest::SHA256.file(file.path).hexdigest
                }

                @size = get_size(file.path)
            }
        end

        private
        def get_size(file)
            size = nil
            Tempfile.open("tmp") { |unpacked|
                unpacked.close

                type = exec("file #{file}")
                if type =~ /gzip/
                    exec("gunzip -d <#{file} >#{unpacked.path}")
                    file = unpacked.path #TODO
                elsif type =~ /bzip2/
                    exec("bzip2 -d <#{file} >#{unpacked.path}")
                    file = unpacked.path #TODO
                elsif type =~ /XZ compressed/
                    exec("xz -d <#{file} >#{unpacked.path}")
                    file = unpacked.path #TODO
                end

                cmd = "qemu-img info --output=json #{file}"
                size = JSON.parse(exec(cmd))['virtual-size']
                # TODO: driver?
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
    end
end

# vim: ai ts=4 sts=4 et sw=4 ft=ruby
