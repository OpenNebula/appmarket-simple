require 'yaml'

class Appliances
    def initialize(dir)
        @dir= dir
        @appliances = nil
        self.reload
    end

    def reload
        if File.directory?(@dir)
            ptrn = @dir + '/**/*.yaml'
        elsif File.file?(@dir)
            ptrn = @dir
        else
            raise "Invalid source #{@dir}"
        end

        new = {}
        Dir.glob(ptrn).each { |fname|
            read_yaml(fname).each { |app|
                # get ID
                if app.has_key?('id')
                    id = app['id']
                elsif app.has_key?('_id') and app['_id'].has_key?('$oid')
                    id = app['id']['$oid']
                else
                    raise "Unknown appliance ID"
                end

                # chek for duplicate ID
                if new.has_key?(id)
                    raise "Duplicate appliance ID #{id}"
                end

                # cleanup appliance structure
                tidy_appliance(app)
                app['_id'] = { '$oid' => id }
                new[id] = app
            }
        }

        @appliances = new
    end

    def get_all_list
        @appliances.values
    end

    def get(id)
        @appliances[id]
    end

    private
    def read_yaml(fname)
        begin
            data = YAML.load_file(fname)
        rescue Exception => e
            raise "Error parsing #{fname}: #{e.message}"
        end

        # multiple appliances
        if data.is_a? Array
            data

        # single appliance - if no id is in metadata,
        # take the filename without extension
        elsif data.is_a? Hash
            unless data.has_key?('id')
                data['id'] = File.basename(fname, '.yaml') 
            end

            [data]
        else
            nil #TODO?
        end
    end

    private
    def tidy_appliance(app)
        app.select! { |k, v|
            %w(name version publisher format short_description
                tags creation_time opennebula_template
                files).include?(k)
        }

        if app.has_key?('files') 
            app['files'].each { |file|
                file.select! { |k, v|
                    %w(type dev_prefix driver location size md5
                        checksum).include?(k)
                }
            }
        end
    end
end
