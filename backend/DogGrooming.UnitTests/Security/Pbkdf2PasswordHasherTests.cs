using DogGrooming.Infrastructure.Security;
using Xunit;

namespace DogGrooming.UnitTests.Security;

public class Pbkdf2PasswordHasherTests
{
    private readonly Pbkdf2PasswordHasher _hasher = new();

    [Fact]
    public void Hash_DoesNotReturnThePlaintext()
    {
        var hash = _hasher.Hash("Passw0rd!");
        Assert.NotEqual("Passw0rd!", hash);
        Assert.Contains(".", hash); // packed as {iterations}.{salt}.{hash}
    }

    [Fact]
    public void Verify_ReturnsTrue_ForCorrectPassword()
    {
        var hash = _hasher.Hash("Passw0rd!");
        Assert.True(_hasher.Verify("Passw0rd!", hash));
    }

    [Fact]
    public void Verify_ReturnsFalse_ForWrongPassword()
    {
        var hash = _hasher.Hash("Passw0rd!");
        Assert.False(_hasher.Verify("wrong-password", hash));
    }

    [Fact]
    public void Hash_IsSalted_SoSamePasswordYieldsDifferentHashes()
    {
        var a = _hasher.Hash("samePassword");
        var b = _hasher.Hash("samePassword");
        Assert.NotEqual(a, b);
        // ...but both still verify against the original password.
        Assert.True(_hasher.Verify("samePassword", a));
        Assert.True(_hasher.Verify("samePassword", b));
    }

    [Fact]
    public void Verify_ReturnsFalse_ForMalformedHash()
    {
        Assert.False(_hasher.Verify("whatever", "not-a-valid-hash"));
    }
}
