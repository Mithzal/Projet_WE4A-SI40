<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AccountManagerController extends AbstractController
{
    #[Route('/account/manager', name: 'app_account_manager')]
    public function index(): Response
    {
        return $this->render('account_manager/accountManager.html.twig', [
            'controller_name' => 'AccountManagerController',
        ]);
    }
}
