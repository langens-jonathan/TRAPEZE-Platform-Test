(in-package :mu-cl-resources)

(defparameter *max-group-sorted-properties* nil)

(define-resource account ()
  :class (s-prefix "foaf:OnlineAccount")
  :properties `((:status :string ,(s-prefix "account:status")))
  :resource-base (s-url "http://mu.semte.ch/vocabularies/ext/accounts/")
  :has-one `((user :via ,(s-prefix "foaf:account")
                   :inverse t
                   :as "user"))
  :on-path "accounts"
)

(define-resource user ()
  :class (s-prefix "foaf:Person")
  :properties `((:name :string ,(s-prefix "foaf:name"))
                (:language :string ,(s-prefix "dct:language"))
				        (:non-hardened-keys :string ,(s-prefix "ext:nonHardenedKeys")))
  :has-one `()
  :has-many `((account :via ,(s-prefix "foaf:account")
                      :as "accounts"))
  :resource-base (s-url "http://mu.semte.ch/vocabularies/ext/users/")
  :on-path "users"
)

