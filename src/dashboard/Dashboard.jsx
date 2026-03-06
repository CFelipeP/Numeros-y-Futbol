import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from "@mui/material";

const drawerWidth = 240;

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6">
            Panel Administrador
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" }
        }}
      >
        <Toolbar />
        <List>
          <ListItem button>
            <ListItemText primary="Inicio" />
          </ListItem>

          <ListItem button>
            <ListItemText primary="Noticias" />
          </ListItem>

          <ListItem button>
            <ListItemText primary="Equipos" />
          </ListItem>

          <ListItem button>
            <ListItemText primary="Usuarios" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4">
          Bienvenido al Dashboard
        </Typography>

        <Typography>
          Aquí podrás administrar el sitio de Números y Fútbol.
        </Typography>
      </Box>

    </Box>
  );
}