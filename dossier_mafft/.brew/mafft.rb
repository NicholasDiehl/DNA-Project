class Mafft < Formula
  desc "Multiple alignments with fast Fourier transforms"
  homepage "https://mafft.cbrc.jp/alignment/software/"
  url "https://gitlab.com/sysimm/mafft.git",
      tag:      "v7.520",
      revision: "52b59f064c600da59bca8233736418fb8bb35d5e"
  license "BSD-3-Clause"

  livecheck do
    url :homepage
    regex(/The latest version is (\d+(?:\.\d+)+)/i)
  end

  def install
    make_args = %W[CC=#{ENV.cc} CXX=#{ENV.cxx} PREFIX=#{prefix} install]
    system "make", "-C", "core", *make_args
    system "make", "-C", "extensions", *make_args
  end

  test do
    (testpath/"test.fa").write ">1\nA\n>2\nA"
    output = shell_output("#{bin}/mafft test.fa")
    assert_match ">1\na\n>2\na", output
  end
end
