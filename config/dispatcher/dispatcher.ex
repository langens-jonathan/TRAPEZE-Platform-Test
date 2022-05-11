defmodule Dispatcher do
  use Matcher

  define_accept_types [
    html: [ "text/html", "application/xhtml+html" ],
    json: [ "application/json", "application/vnd.api+json" ],
  ]

  @any %{}
  @json %{ accept: %{ json: true } }
  @html %{ accept: %{ html: true } }

  match "/backend/*path", @any do
    Proxy.forward conn, path, "http://backend/"
  end

  match "/sessions/*path", @any do
    Proxy.forward conn, path, "http://login/sessions/"
  end

  match "/accounts/*path", @any do
    Proxy.forward conn, path, "http://resource/accounts/"
  end

  match "/frontend/*path", @any do
    Proxy.forward conn, path, "http://frontend/"
  end

  match "_", %{ last_call: true } do
    send_resp( conn, 200, "OK" )
  end
end
