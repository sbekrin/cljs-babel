(ns jest.test)

(describe "jest"
          (it "works"
              (.to-be (expect (* 2 2)) 4)))
