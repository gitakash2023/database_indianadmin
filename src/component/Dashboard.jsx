"use client"
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Hidden, CssBaseline, Box, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, AccountCircle as AccountCircleIcon, Settings as SettingsIcon, ExitToApp as ExitToAppIcon, Assignment as AssignmentIcon, Description as DescriptionIcon, CheckCircle as CheckCircleIcon, ListAlt as ListAltIcon, Book as BookIcon, ChromeReaderMode as ChromeReaderModeIcon, Web as WebIcon, AccountTree as AccountTreeIcon, AssignmentTurnedIn as AssignmentTurnedInIcon, FormatListBulleted as FormatListBulletedIcon } from '@mui/icons-material';

import Jobs from "./Jobs"
import Blogs from "./Blogs"
import AdmitCard from "./AdmitCard"
import Results from "./Results"
import  AnswersKey from "./AnswersKey"
import OldPaper from "./OldPaper"
import Books from "./Books"

const drawerWidth = 240;

const menuItems = [
  
  { text: 'Jobs', icon: <AssignmentIcon />, key: 'jobs' },
  { text: 'Admit Cards', icon: <DescriptionIcon />, key: 'admit-cards' },
  { text: 'Results', icon: <CheckCircleIcon />, key: 'results' },
  { text: 'Answers Keys', icon: <ListAltIcon />, key: 'answers-key' },
  { text: 'Old Papers', icon: <ChromeReaderModeIcon />, key: 'old-paper' },
  { text: ' Books', icon: <BookIcon />, key: 'free-books' },
  { text: 'Blogs', icon: <FormatListBulletedIcon />, key: 'blog' },
  { text: 'Webstories', icon: <WebIcon />, key: 'webstories' },
 
  { text: 'Mock Tests', icon: <AssignmentTurnedInIcon />, key: 'mock-tests' }
];

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('dashboard');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleItemClick = (item) => {
    setContent(item);
    setOpen(false);
  };

  const handleAccountMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const renderContent = () => {
    switch (content) {
     
      case 'jobs':
        return (
          <Jobs/>
        );
      case 'admit-cards':
        return (
          <AdmitCard/>
        );
      case 'results':
        return (
          <Results/>
        );
      case 'answers-key':
        return (
          <AnswersKey/>
        );
      case 'old-paper':
        return (
        <OldPaper/>
        );
      case 'free-books':
        return (
         <Books/>
        );
      case 'blog':
        return (
         <Blogs/>
        );
      case 'webstories':
        return (
          <Typography variant="h4" sx={{ color: '#003366' }} gutterBottom>
            Webstories Page
          </Typography>
        );
     
      case 'mock-tests':
        return (
          <Typography variant="h4" sx={{ color: '#003366' }} gutterBottom>
            Mock Tests Page
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#3B4B5C' }}>
  <Toolbar sx={{ justifyContent: 'space-between' }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Hidden mdUp>
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ marginRight: 2, color: '#fff' }}
        >
          <MenuIcon />
        </IconButton>
      </Hidden>
      <Typography variant="h6" noWrap>
        Admin Dashboard
      </Typography>
    </Box>
    <Typography variant="h6" noWrap sx={{ textAlign: 'center', flex: 1 }}>
      Welcome to Indian Sarkari
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleAccountMenuOpen}
        color="inherit"
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleAccountMenuClose}
      >
        <MenuItem onClick={handleAccountMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        <MenuItem onClick={handleAccountMenuClose}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </Box>
  </Toolbar>
</AppBar>




      <Hidden smDown>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              backgroundColor: '#3B4B5C',
              color: '#fff',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem button key={item.key} onClick={() => handleItemClick(item.key)} sx={{ '&:hover': { backgroundColor: '#54c6ff' } }}>
                  <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} sx={{ color: '#fff' }} />
                </ListItem>
              ))}
            </List>
         
            </Box>
      </Drawer>
    </Hidden>
    <Hidden mdUp>
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerClose}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#3B4B5C',
            color: '#fff',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.key} onClick={() => handleItemClick(item.key)} sx={{ '&:hover': { backgroundColor: '#54c6ff' } }}>
                <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: '#fff' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Hidden>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      {renderContent()}
    </Box>
  </Box>
);
};

export default Dashboard;
