 <!-- Navbar -->
 <nav class="main-header navbar navbar-expand navbar-white navbar-light">
     <!-- Left navbar links -->
     <ul class="navbar-nav">
         <li class="nav-item">
             <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
         </li>
         <li class="nav-item d-none d-sm-inline-block">
             <a href="#" class="nav-link px-0 pt-1">
                 <label class="text-md"><?= isset($page_title) ? $page_title : ''; ?></label>
             </a>

         </li>
     </ul>

     <!-- Right navbar links -->
     <ul class="navbar-nav ml-auto">


         <li class="nav-item dropdown user-menu">
             <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
                 <img src="/<?= env('APP_DISK') ?>/users/default.png" class="user-image img-circle elevation-2" alt="User Image">
                 <span class="d-none d-md-inline">Clarence Andaya</span>
             </a>
             <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right p-1">
                 <!-- <span class="dropdown-item dropdown-header">15 Notifications</span> -->
                 <!-- <div class="dropdown-divider"></div> -->
                 <a href="#" class="dropdown-item py-2 header_settings">
                     <i class="fas fa-cog  mr-2"></i>Settings
                 </a>
                 <!-- <div class="dropdown-divider"></div> -->
                 <a href="#" class="dropdown-item py-2 header_profile">
                     <i class="fas fa-user mr-2"></i> Profile
                 </a>
                 <!-- <div class="dropdown-divider"></div> -->
                 <a href="#" class="dropdown-item py-2 header_lock">
                     <i class="fas fa-lock mr-2"></i> Lock Screen
                 </a>
                 <!-- <div class="dropdown-divider"></div> -->
                 <a href="<?= url('logout') ?>" class="dropdown-item  py-2">
                     <i class="fas fa-sign-out-alt mr-2"></i> Sign out
                 </a>
                 <!-- <div class="dropdown-divider"></div> -->
                 <!-- <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a> -->
             </div>

         </li>
     </ul>
 </nav>
 <!-- /.navbar -->