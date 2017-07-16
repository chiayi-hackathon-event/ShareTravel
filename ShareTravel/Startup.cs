using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ShareTravel.Startup))]
namespace ShareTravel
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
